var Models = require('../models/models.js');

module.exports = {
	addTransaction : addTransaction,
	transferMoney : transferMoney,
	moveMoney : moveMoney,
	getMoniesByCategoryAndDate : getMoniesByCategoryAndDate
};

function moveMoney(moneyId, categoryId){
	return (function(moneyId, categoryId){
		this.category = null;
		return new Promise(function(resolve, reject){
			resolve(Models.Category.findById(categoryId));
		})
		.then(category => {
			this.category = category;
			if(!category) throw new Error('Could not find Category!');
			return Models.Money.findById(moneyId);
		})
		.then(money => {
			if(!money) throw new Error('Could not find Money!');
			return money.update({"categoryId" : this.category.id});
		});
	})(moneyId, categoryId);
}

function addTransaction(categoryId, date, description, debit, credit, balance){
	return (function(categoryId, date, description, debit, credit, balance){

		return new Promise(function(resolve, reject){
			resolve(Models.Category.findById(categoryId));
		})
		.then(category => {
			if(!category) throw new Error('Could not find Category!');

			return Models.Transaction.create({
				"description" : description,
				"debit" : debit,
				"credit" : credit,
				"balance" : balance,
				"date" : date
			});

		})
		.then(transaction => {
			return Models.Money.create({
				"description" : transaction.description,
				"debit" : transaction.debit,
				"credit" : transaction.credit,
				"date" : transaction.date,
				"categoryId" : categoryId,
				"transactionId" : transaction.id
			});
		}, error => {console.log(error)});

	})(categoryId, date, description, debit, credit, balance);
};

function transferMoney(moneyId, amount, categoryId, description){
	return new Promise(function(resolve, reject){
		resolve(Models.Category.findById(categoryId));
	})
	.then(category => {
		if(!category) throw new Error('Could not find Category!');
		return Models.Money.findById(moneyId);
	})
	.then(money => {
		if(!money) throw new Error('Could not find Money!');

		var updateMoney = {
			debit : money.debit > 0 ? money.debit - amount : 0,
			credit : money.credit > 0 ? money.credit - amount : 0
		};

		newMoney = {
			categoryId : categoryId || money.categoryId,
			description : description || money.description,
			transactionId : money.transactionId,
			debit : money.debit > 0 ? amount : 0,
			credit : money.credit > 0 ? amount : 0,
			date : money.date
		};

		if(updateMoney.debit < 0 || updateMoney.credit < 0) throw new Error('Cannot split money greater than existing amount!');

		if(updateMoney.debit == 0 && updateMoney.credit == 0){
			return money.update({categoryId : this.categoryId});
		}else{
			var updatePromise = money.update(updateMoney);
			var createMoney = Models.Money.create(newMoney);
			return Promise.all([updatePromise, createMoney]);
		}
	})
}

function getMoniesByCategoryAndDate(categoryId, fromDate, toDate){
	return Models.Money.findAll({
		where: {
			categoryId : categoryId,
			date : {$or : {$gte : fromDate, $lte: toDate}}
		}
	});
}
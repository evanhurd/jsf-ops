var Models = require('../models/models.js');

var transaction = new Transaction();

module.exports = {
	addTransaction : transaction.addTransaction,
	transferMoney : transaction.transferMoney,
	moveMoney : transaction.moveMoney,
	getMoniesByCategoryAndDate : transaction.getMoniesByCategoryAndDate,
	transaction : Transaction
};

function Transaction(sqlTransaction){
	var categories = {};
	return {
		addTransaction : addTransaction,
		transferMoney : transferMoney,
		moveMoney : moveMoney,
		getMoniesByCategoryAndDate : getMoniesByCategoryAndDate
	};

	function moveMoney(moneyId, categoryId){
		return (function(moneyId, categoryId){
			this.category = null;
			return new Promise(function(resolve, reject){
				if(categories[categoryId] && sqlTransaction) return resolve(categories[categoryId]);
				resolve(Models.Category.findById(categoryId));
			})
			.then(category => {
				this.category = category;
				if(!category) throw new Error('Could not find Category!');
				categories[categoryId] = category;
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
				if(categories[categoryId] && sqlTransaction) return resolve(categories[categoryId]);
				resolve(Models.Category.findById(categoryId));
			})
			.then(category => {
				if(!category) throw new Error('Could not find Category!');
				categories[categoryId] = category;

				var transactionObject = {
					"description" : description,
					"debit" : debit || 0,
					"credit" : credit || 0,
					"balance" : balance || 0,
					"date" : date
				};

				return Models.Transaction.findOrCreate({
					where : transactionObject,
					defaults : transactionObject,
					transaction : sqlTransaction
				});

			})
			.then((result, created) => {
				var transaction = result[0];
				if(!result[1]) return transaction;

				return Models.Money.create({
					"description" : transaction.description,
					"debit" : transaction.debit,
					"credit" : transaction.credit,
					"date" : transaction.date,
					"categoryId" : categoryId,
					"transactionId" : transaction.id
				}, {transaction: sqlTransaction});
			}, error => {console.log(error)});

		})(categoryId, date, description, debit, credit, balance);
	};

	function transferMoney(moneyId, amount, categoryId, description){
		return new Promise(function(resolve, reject){
			if(categories[categoryId] && sqlTransaction) return resolve(categories[categoryId]);
			resolve(Models.Category.findById(categoryId));
		})
		.then(category => {
			if(!category) throw new Error('Could not find Category!');
			categories[categoryId] = category;

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
}
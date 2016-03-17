var Models = require('../models/models.js');
var Promise = require('promise');

module.exports = {
	addTransaction : addTransaction,
	splitTransaction : splitTransaction
};

function addTransaction(categoryId, date, description, debit, credit, balance){
	return new Promise(function(resolve, reject){
		var categoryId = categoryId || 1;
		var date = date || new Date().toString();
		var description = description || '';
		var debit = debit || 0;
		var credit = credit || 0;
		var balance = balance || 0;

		var newCategory = null;
		var newMoney = null;
		console.log(categoryId);
		Models.Category.findById(categoryId)
		.then(function(category){
			console.log(category);
			if(!category) return reject('Could not find Category!');
			Models.Transaction.create({
				"description" : description,
				"debit" : debit,
				"credit" : credit,
				"balance" : balance,
				"date" : date
			})
			.then(function(transaction){
				Models.Money.create({
					"description" : description,
					"debit" : debit,
					"credit" : credit,
					"balance" : balance,
					"date" : date,
					"categoryId": category.id,
					"transactionId": transaction.id
				})
				.then(resolve, reject);
			}, reject)
		}, reject)
	});
};

function splitTransaction(moneyId, amount, description, categoryId){
	return new Promise(function(resolve, reject){
		new Run(
			{
				moneyId : moneyId,
				amount : amount,
				description : description,
				categoryId : categoryId	
			},

			function(next){
				if(!this.categoryId) return next();
				Models.Category.findById(this.categoryId)
				.then(function(category){
					if(!category) return reject('Could not find Category!')
					next(category)
				})
			},

			function(next){
				if(!this.categoryId) return next();
				Models.Money.findById(this.categoryId)
				.then(function(money){
					if(!money) return reject('Could not find Money!');
					this.categoryId = this.categoryId || money.categoryId;
					this.description = this.description || money.description;
					this.debit = money.debit > 0 ? money.debit - this.amount : 0;
					this.credit = money.credit > 0 ? money.credit - this.credit : 0;

					if(this.debit < 0 || this.credit < 0) return reject('Cannot Split money greater than existing amount!');

					next(money);
				}.bind(this))
			},

			function(next, money){
				if(this.debit == 0 && this.credit == 0){
					money.update({categoryId : this.categoryId})
					.then(resolve, reject);
				}else{
				money.update({debit : this.debit, credit: this.credit})
				.then(function(money){ next(money)}, reject);			
				}
			},

			function(money){
				Models.Money.create({
					"description" : this.description || money.description,
					"debit" : this.debit,
					"credit" : this.credit,
					"balance" : 0,
					"date" : money.date,
					"categoryId": this.categoryId,
					"transactionId": money.transactionId
				})
				.then(function(newMoney){
					resolve(newMoney, money);
				}, reject);
			}
		)

	});
}
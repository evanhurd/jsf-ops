var Ops = require('./operations/ops.js');

module.exports = {
	newCategory: newCategory,
	createRule: createRule,
	listRules: listRules,
	removeRule: removeRule,
	importMoney: importMoney,
	transfer: transfer,
	list: list,
	balance: balance,
	balanceCategory: balanceCategory,
	createForcast: createForcast,
	getForcast: getForcast
};

function categories(){
	
}

function newCategory(name){
	resolve(Ops.Category.addCategory(name));
}

function createRule(options, program){

}

function listRules(options, program){

}

function removeRule(options, program){

}

function importMoney(options, program){

}

function transfer(moneyId, amount, categoryId){
	return Ops.Money.transferMoney(moneyId, amount, categoryId);
}

function monies(options, program){

}

function balance(options, program){

}

function balanceCategory(options, program){

}

function createForcast(options, program){

}

function getForcast(options, program){

}


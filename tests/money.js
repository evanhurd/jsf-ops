var Ops = require('../operations/ops.js');

new Promise((resolve, reject) => {
	resolve(Ops.Category.addCategory('Root'));
})
.then(category => {
	console.log("Created Category:", category != null);
	return Ops.Money.addTransaction(category.id, '2005-02-02', 'test', 0, 50.04, 50.04);
})
.then(money => {
	console.log("Created Money:", money != null);
	return Ops.Money.transferMoney(money.id, 25, money.categoryId);
}, logReject)
.then((money) => {
	console.log("Split Money:", money != null);
	return create_fake_charges(100);
}, logReject)
.then(function(){
	return create_accounts();
}, logReject)
.then(function(){
	return Ops.Money.moveMoney(10,2);
}, logReject)
.then(money => {
	console.log("Moving Money:", money.categoryId == 2);
	return Ops.Balance.updateBalance(2);
}, logReject)
.then(result => {
	return Ops.ImportRule.createRule(1, 'Starbucks', '/starbucks/gi');
}, logReject)
.then(rule => {
	console.log("Create New Rule:", rule != null);
}, logReject);


function logReject(reject){
	console.log("REJECT:", reject);
}

function create_accounts(){
	var promiseArray = [
		Ops.Category.addCategory('Credits'),
		Ops.Category.addCategory('Account 1'),
		Ops.Category.addCategory('Account 2'),
		Ops.Category.addCategory('Account 3'),
		Ops.Category.addCategory('Account 4')
	];
	return Promise.all(promiseArray);
}


function create_fake_charges(count){
	var balance = 0;
	var year =  2015;
	var month = 1;
	var day = 0;
	var promiseArray = [];
	for(var i = 0; i < count; i++){
		day+=7;
		var amount = Math.floor(Math.random() * 100);
		var isDebit = Math.floor(Math.random() * 100) > 60;
		var debit = isDebit ? amount : 0;
		var credit = !isDebit ? amount * 10 : 0;
		var date = year + '-' + month + '-' + day;

		balance += credit - debit;
		promiseArray.push(
			Ops.Money.addTransaction(1, date, 'Test Charge ' + i, debit, credit, balance)
		);

		if(day > 22) {
			day = 0;
			month++;
		}

		if(month > 12) {
			year++;
			month = 1;
		}

	}

	return Promise.all(promiseArray);
}
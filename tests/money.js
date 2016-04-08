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
	//return new Promise((resolve, reject) => {});
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
	return Ops.ImportRule.createRule(2, 'FUZZYS', 'FUZZYS');
}, logReject)
.then(rule => {
	console.log("Create New Rule:", rule != null);
	return create_rules();
}, logReject)
.then(rules => {
	console.log("Create Categories and Rules:", rules.length > 0);
	console.log("Importing Money");
	return Ops.ImportCSV("/home/evan/Dropbox/AccountHistory_full.csv",1);
}, logReject)
.then(results => {
	console.log(results.length);
	return Ops.ImportCSV("/home/evan/Dropbox/AccountHistory.csv",1);
}, logReject)
.then(money => {
	console.log("Updating All Balances");
	return Ops.Balance.updateAllBalances();
}, logReject)
.then(money => {
	console.log("Creating Balance Focast Test Rule Category");
	return createCategoryAndRule("BalanceForcast", 'BalanceForcast');
}, logReject)
.then(results => {
	return Ops.ImportCSV("/home/evan/git/jsFinance-cmd/tests/test.csv",1);
}, logReject)
.then(money => {
	return Ops.Balance.updateBalance(12);
}, logReject)
.then(money => {
	console.log("Creating Forcasts");
	return Ops.Forcast.createForcast(12, new Date(), '04/04/2017', 4, '01/01/2014');
	//return Ops.Forcast.createAllForcasts(new Date(), '04/04/2017', 4, '01/01/2014');
}, logReject)


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
	console.log("Create Charges");
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

function create_rules(){
	return Promise.all([
		createCategoryAndRule("Food", 'Fuzzy|coffee|SPRING CREEK|VEND PRO II IRVING|RAISING CANE|BUFFALO WILD|YELLOW ROSE|PRIME|TACO BELL|STARBUCKS'),
		createCategoryAndRule("Grocery", 'Food|WallMart|Albertsons'),
		createCategoryAndRule("Gas", 'LOVES|FASTOP|CHEVRON|SHELL|QUIKTRIP'),
		createCategoryAndRule("Tech", 'AMAZON|DROPBOX'),
		createCategoryAndRule("Income", 'WILCOMP|PAYROLL')
	]);
}

function createCategoryAndRule(name,rule){
	return (function(name,rule){
		return Ops.Category.addCategory(name)
		.then(category =>{
			return Ops.ImportRule.createRule(category.id, name, rule);
		});
	})(name,rule)
}
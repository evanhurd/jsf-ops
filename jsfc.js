#!/usr/bin/env node
var program = require('commander');


program.customOption = customOption;

program
	.version('0.0.1')
	.customOption('-C, --new-category <name>', 'create a category')
	.customOption('-R, --create-rule <name> <categoryId> <regexmatch>', 'create a import rule')
	.customOption('-L, --list-rules <categoryId>', 'list import rules')
	.customOption('-r, --remove-rule <ruleId>', 'remove a rule')
	.customOption('-I, --import-money <file> <categoryId>', 'import transactions from csv')
	.customOption('-T, --transfer <moneyId> <categoryId> <amount>', 'transfer money to a category')
	.customOption('-l, --list <categoryId> <fromDate> <toDate>', 'list transactions in a category')
	.customOption('-b, --balance <categoryId> <a>..<b>', 'get balance for a range of dates')
	.customOption('-B, --balance-category <categoryId> <fromCategory>', 'balance category with the credits of another category')
	.customOption('-F, --create-forcast <categoryId> <toDate>', 'create a forcast to a particular date')
	.customOption('-f, --get-forcast <categoryId>', 'get a forcast for a category')
	.customOption('-j, --json', 'return json response')
	.parse(process.argv);

if(program.json) jsCommands.newCategory(program.newCategory);

if(program.newCategory) jsCommands.newCategory(program.newCategory);
if(program.createRule) jsCommands.createRule(program.reateRule);
if(program.listRules) jsCommands.listRules(program.listRules);
if(program.removeRule) jsCommands.removeRule(program.removeRule);
if(program.importMoney) jsCommands.importMoney(program.importMoney);
if(program.transfer) jsCommands.transfer(program.transfer);
if(program.list) jsCommands.list(program.list);
if(program.balance) jsCommands.balance(program.balance);
if(program.balanceCategory) jsCommands.balanceCategory(program.balanceCategory);
if(program.createForcast) jsCommands.createForcast(program.createForcast);
if(program.getForcast) jsCommands.getForcast(program.getForcast);

function customOption(name, description){
	var options = (name.match(/<(.[^><]*)>/g) || []).map(function(option){
		var option = option.replace('<','').replace('>','');
		return option;
	});

	this.option(name, description, function(options, arg, value){
		var defaultArgLength = program.rawArgs.length - options.length;
		var value = {};
		for(var i = options.length-1; i>= 0;i--){
			value[options[i]] = 
			program.rawArgs[defaultArgLength + i];
		}
		return value;
	}.bind({index : -1}, options), undefined);

	return this;
}
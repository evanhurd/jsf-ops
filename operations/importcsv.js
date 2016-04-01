var Models = require('../models/models.js');
var ImportRule = require('./importrule.js');
var Money = require('./money.js');
var Converter = require("csvtojson").Converter;
var db = require('../models/db.js');


module.exports = function(file, categoryId){
	

	return db.transaction(function (t) {

		var MoneyTransaction = Money.transaction(t);

		return Promise.all([
			ImportRule.getRules(),
			convertCSVFile(file)
		])
		.then((result) => {
			var rules = result[0], rows = result[1];
			
			var promiseArray = [];

			for(var i = 0; i < rows.length;i++){
				var dateParts = rows[i]['Post Date'].split('/');
				var categoryPlacment = findExecRuleList(rules, rows[i]['Description']) || categoryId;

				promiseArray.push(MoneyTransaction.addTransaction(
					categoryPlacment,
					dateParts[2] + "/" + dateParts[0] + "/"+ dateParts[1],
					rows[i]['Description'],
					rows[i]['Debit'],
					rows[i]['Credit'],
					rows[i]['Balance']
				));
			}

			return Promise.all(promiseArray);
		});

	});
}


function findExecRuleList(rules, description){
	for(var i = 0; i < rules.length; i++){
		var rule = rules[i];
		try{
			if(new RegExp(rule.regex, 'i').exec(description)) return rule.categoryId;
		}catch(err){}
	}
	return 0;
}


function convertCSVFile(file){
	var converter = new Converter({});
	return new Promise((resolve, reject) =>{

		converter.fromFile(file, function(err,result){
			if(err) reject(err);
			resolve(result);
		})

	});
}
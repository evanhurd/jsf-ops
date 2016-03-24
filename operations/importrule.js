var Models = require('../models/models.js');

module.exports = {
	createRule : createRule,
	getRules : getRules,
	deleteRule : deleteRule,
	updateRule : updateRule
};

function createRule(categoryId, description, regex){
	return Models.ImportRule.create({
		categoryId : categoryId,
		description : description,
		regex : regex
	});
}

function getRules(){
	return Models.ImportRule.findAll();
}

function deleteRule(importRuleId){
	return Models.ImportRule.fineById(importRuleId)
	.then(rule => {
		return rule.delete();
	});
}

function updateRule(importRuleId, categoryId, description, regex){
	return Models.ImportRule.fineById(importRuleId)
	.then(rule => {
		return rule.update({
			categoryId : categoryId,
			description : description,
			regex : regex
		});
	});
}
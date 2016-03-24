var Models = require('../models/models.js');

module.exports = {
	addCategory : addCategory,
	getCategories : getCategories
};

function addCategory(name, categoryId){
	return Models.Category.create({
		name : name, 
		categoryId : categoryId || 0
	});
}

function getCategories(){
	return Models.Category.findAll();
}
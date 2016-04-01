var Models = require('../models/models.js');
var db = require('../models/db.js');
var Category = require('./category.js');

module.exports = {
	updateBalance : updateBalance,
	updateAllBalances : updateAllBalances
};

function updateBalance(categoryId){
	var sql = `CALL update_balance(${categoryId})`;
	return db.query(sql, { type: db.QueryTypes.SELECT});
}

function updateAllBalances(){
	return Category.getCategories()
	.then(categories => {

		var promiseArray = [];
		for(var i = 0; i < categories.length;i++){
			promiseArray.push(updateBalance(categories[i].id));
		}

		return Promise.all(promiseArray);
	})
}
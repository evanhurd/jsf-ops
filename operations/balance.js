var Models = require('../models/models.js');
var db = require('../models/db.js');
var Category = require('./category.js');

module.exports = {
	updateBalance : updateBalance,
	updateAllBalances : updateAllBalances,
	getCategoryBalances : getCategoryBalances,
	getMonthsAverage : getMonthsAverage,
	getWeeksAverage : getWeeksAverage,
	getAverage : getAverage,
	getAverageOfLastFewMonths : getAverageOfLastFewMonths
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

function getCategoryBalances(categoryId){
	return Models.findAll({categoryId : categoryId});
}

function getMonthsAverage(categoryId, fromYear){
	var sql = `select
			avg(credits) as credits,
			avg(debits) as debits,
			month
		from balances
		where categoryId = ${categoryId} and month != 0
		and year >= ${fromYear}
		group by month
		order by month;`;
	return db.query(sql, { type: db.QueryTypes.SELECT});
}

function getWeeksAverage(categoryId, fromYear){
	var sql = `select
			avg(credits) as credits,
			avg(debits) as debits,
			week
		from balances
		where categoryId = ${categoryId} and week != 0
		and year >= ${fromYear}
		group by week;`;
	return db.query(sql, { type: db.QueryTypes.SELECT});
}

function getAverage(categoryId, fromYear){
	var sql = `select
			avg(credits) as credits,
			avg(debits) as debits
		from balances
		where categoryId = ${categoryId} and week = 0
		and year >= ${fromYear}`;
	return db.query(sql, { type: db.QueryTypes.SELECT});
}

function getAverageOfLastFewMonths(categoryId, count){
	var sql = `select avg(credits) as credits, avg(debits) as debits from (
			SELECT
				credits,
				debits
			FROM balances
			WHERE categoryId = ${categoryId} AND week = 0
			ORDER BY year DESC, month DESC
			LIMIT ${count}
		) data;`;
	return db.query(sql, { type: db.QueryTypes.SELECT});
}
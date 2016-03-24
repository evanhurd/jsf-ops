var Models = require('../models/models.js');
var db = require('../models/db.js');

module.exports = {
	updateBalance : updateBalance
};

function updateBalance(categoryId){
	var sql = `CALL update_balance(${categoryId})`;
	return db.query(sql, { type: db.QueryTypes.SELECT});
}
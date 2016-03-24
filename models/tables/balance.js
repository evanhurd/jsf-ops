var db = require('../db.js');
var Category = require('./category.js');

var Balance = db.define('balance', {
	  id : { type: db.DataTypes.INTEGER, unique: 'compositeIndex', primaryKey: true, autoIncrement: true}
	, week : {type: db.DataTypes.INTEGER, defaultValue: 0 }
	, month : {type: db.DataTypes.INTEGER, defaultValue: 0 }
	, year : {type: db.DataTypes.INTEGER, defaultValue: 0 }
	, balance : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
	, debits : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
	, credits : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
});

Category.hasMany(Balance);

module.exports = Balance;

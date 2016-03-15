var db = require('../db.js');

var Category = db.define('category', {
	  id : { type: db.DataTypes.INTEGER, unique: 'compositeIndex', primaryKey: true, autoIncrement: true}
	, name : db.DataTypes.STRING
	, description : db.DataTypes.STRING
	, balance : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
});

module.exports = Category;
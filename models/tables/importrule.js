var db = require('../db.js');
var Category = require('./category.js');

var ImportRule = db.define('importrule', {
	  id : { type: db.DataTypes.INTEGER, unique: 'compositeIndex', primaryKey: true, autoIncrement: true}
	, description : db.DataTypes.STRING
	, regex : db.DataTypes.STRING
});

Category.hasMany(ImportRule);

module.exports = ImportRule;
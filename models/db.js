var Sequelize = require('sequelize');
var fs = require('fs')
fs.truncate('./logs.txt', 0, function(){console.log('done')})

var sequelize = new Sequelize('jsfinance', 'root', 'stingray', {
  host: '127.0.0.1',
  port : 3306,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  logging : log
});

sequelize.DataTypes = Sequelize;

module.exports = sequelize;

function log(msg){
	fs.appendFile('./logs.txt', msg + '\n', function (){});
}
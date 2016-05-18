var fs = require('fs');

module.exports = function(file, data){
	return fs.writeFile(file, data);
} 

var fs = require('fs');

module.exports = ReadFile;

function ReadFile(filePath){
	return new Promise(function(resolve, reject){

		fs.readFile(filePath, 'utf8', function (err,data) {
		  if (err) {
		    reject(err);
		  }
		  resolve(data);
		});

	});
}
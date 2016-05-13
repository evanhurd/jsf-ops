var fs = require('fs');

module.exports = ReadFile;

function ReadFile(filePath){
	return new Promise(function(resolve, reject){

		return fs.readFile(filePath, 'utf8', function (err,data) {
		  if (err) {
		    return reject(err);
		  }
		  return resolve(data);
		});

	});
}
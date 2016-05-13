var fs = require('fs');
var FileCompilerObject = require('./FileCompilerObject');

module.exports = GetFileObjects;

function GetFileObjects(fileList){
	return new Promise(function(resolve, reject){

		var files = [];
		var promises = [];
		for(var i = 0; i < fileList.length; i++){
			var fileObject = new FileCompilerObject(fileList[i]);
			files.push(fileObject);
		}

		resolve(files);
	});
}
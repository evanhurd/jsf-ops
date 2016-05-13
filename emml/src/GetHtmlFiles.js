var fs = require('fs');
var recursiveReadSync = require('recursive-readdir-sync');

module.exports = GetHtmlFiles;

function GetHtmlFiles(srcDir){
	return new Promise(function(resolve, reject){

		var allFiles = recursiveReadSync(srcDir);
		var files = [];
		for(var i = 0; i < allFiles.length; i++){
			if(allFiles[i].endsWith(".html") || allFiles[i].endsWith(".htm")){
				files.push(allFiles[i])
			}
		}

		resolve(files);

	});
} 

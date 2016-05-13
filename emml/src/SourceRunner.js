var GetHtmlFiles = require('./GetHtmlFiles');
var GetFileObjects = require('./GetFileObjects');
var PromiseIterator = require('./PromiseIterator');
var SourceObject = require('./SourceObject');


module.exports = SourceRunner;

function SourceRunner(directory){
	return new Promise(function(resolve, reject){

		GetHtmlFiles(directory)
		.then(GetFileObjects, reject)
		.then(function(files){
			var fileIndex = -1;
			
			return PromiseIterator(function(){
				fileIndex++;
				var file = files[fileIndex];
				if(!file) return files;

				return file.readFile()
				.then(file.parseXML, reject)
				.then(file.runTags, reject)
				.then(file.compile, reject)
				.catch(err =>{
					reject(err);
				});

			})
			.catch(reject);

		})
		.then(function(files){
			var sourceObject = new SourceObject(directory, files);
			resolve(sourceObject);
		})
		.catch(reject);
	});
}
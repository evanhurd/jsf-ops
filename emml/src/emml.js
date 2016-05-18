var SourceRunner = require('./SourceRunner');
var WriteFile = require('./WriteFile');

var srcDir = "../sample";
var outputFile = "../sample/app.js";

SourceRunner(srcDir)
.then(sourceObject =>{
	return sourceObject.compile();
})
.then(src => {
	return WriteFile(outputFile, src);
})
.catch(reportError)


function reportError(err){
	console.log(err, err.stack);
}
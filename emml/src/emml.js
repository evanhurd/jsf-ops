var ReadFile = require('./ReadFile');
var ParseXML = require('./ParseXML');
var TagRunner = require('./TagRunner');
var Compiler = require('./Compiler');

ReadFile('../sample/view.html')
.then(ParseXML, reportError)
.then(TagRunner, reportError)
.then(Compiler, reportError)
.then(XMLObject => {
	//console.log(XMLObject);
})
.catch(err =>{
	console.log(err.stack);
});

function reportError(err){
	console.log(err.stack);
}
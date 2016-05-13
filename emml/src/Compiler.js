var escodegen = require('escodegen');

module.exports = Compliler;

function Compliler(tagTree){
	return new Promise(function(resolve, reject){

		var expressions = tagTree.compile();
		//console.log(expressions);

		var programBody = {
		  "type": "Program",
		  "body": expressions,
		  "sourceType": "script"
		};

		//console.log(JSON.stringify(expressions, null, 4));
		//var js = escodegen.generate(programBody);
		//console.log(programBody);
        resolve(programBody);
	});
}


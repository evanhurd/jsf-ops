var astMap = require('./astMap.js');
var esprima = require('esprima');
var escodegen = require('escodegen');
var AstStatements = require('../AstStatements');

module.exports = function(ast){

	//var ast1 = esprima.parse('"A${test - test2} B ${test3}";');
	//parseTemplateStrings(ast1);
	parseTemplateStrings(ast);
	//console.log(escodegen.generate(ast1));
	return ast;
}

function parseTemplateStrings(ast){
	
	var map = new astMap(ast);
	var results = map.find(/(Literal)/);

	for(var x = 0; x < results.length; x++){
		var Literal = results[x][0].node,
		templateString = '';

		if(Literal.value == null || Literal.value.length == 0) continue;
		var bites = [];
		var startIndex = 0;

		var regex = /(\$\{.*?\})/g, t;
		while((t = regex.exec(Literal.value))){
			var toIndex = t.index;
			var biteLength = t[0].length -1;

			if(toIndex > startIndex){
				bites.push(Literal.value.slice(startIndex, toIndex));
			}

			bites.push(Literal.value.substr(toIndex, t[0].length));
			startIndex = toIndex + biteLength + 1;
		}

		if(startIndex < Literal.value.length -1){
			bites.push(Literal.value.slice(startIndex));
		}

		var expressions = [];

		if(bites.length == 0) continue;

		for(var i = 0; i < bites.length; i++){
			var bite = bites[i];
			if(bite.substr(0,2) == "${" && bite.slice(-1) == '}'){
				var js = bite.substr(2,bite.length - 3);
				var Program = esprima.parse(js);
				var ExpressionStatement = Program.body[0];
				var BinaryExpression = ExpressionStatement.expression;
				expressions.push(BinaryExpression);
			}else{
				expressions.push(AstStatements.Literal(bite));
			}
		}

		if(expressions.length > 1){
			var left = expressions.shift();
			var right = expressions.shift();

			var leftExpression =  AstStatements.BinaryExpression('+', left, right);

			while(expressions.length > 0){
				var right = expressions.shift();
				var leftExpression =  AstStatements.BinaryExpression('+', leftExpression, right);
			}

			var expression = leftExpression;
		}else{
			var expression = expressions[0];
		}

		Literal.$parent[Literal.$key] = expression;
	}	

	return ast;
}

/*

	var t, endString,
		returnString = "", i = 0, regex = /(\$\{.*?\})/g;

	while( (t = regex.exec(str)) ){
		var toIndex = t.index;
		var biteLength = t[0].length - 1;
		var jsBite = t[0].slice(2, biteLength);
		returnString += returnString.length > 0 ? "+" : "";
		returnString+= "\"" + str.slice(i, toIndex) + "\"+" + jsBite;
		var i = toIndex + biteLength + 1;
	}
*/
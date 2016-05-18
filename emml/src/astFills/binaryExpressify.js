/*
Turn all object.key to $scope.object.key
*/
var rootScopeIdentifer = "$scope";
var escodegen = require('escodegen');

var esprima = require('esprima');
var astMap = require('./astMap.js');

module.exports = function(ast){
	return binaryExpressify(ast);
}

function binaryExpressify(ast){

	var expressions = findAllDOMCallExpressions(ast);
	//console.log(expressions.length);

	for(var i = 0; i < expressions.length; i++){
		convertBinaryExpressionsInCallExpression(expressions[i]);
	}

	return ast;
}

function convertBinaryExpressionsInCallExpression(callExpression){
	var binaryExpression;

	var counter = 0;

	while(binaryExpression = findOneBinaryExpression(callExpression)){

		binaryExpression.type = "CallExpression";
		binaryExpression.callee = {                                                                                                    
            "type": "Identifier",                                                                                      
            "name": "BinaryExpression"                                                                                             
        };
        binaryExpression.arguments = [
        	{                                                                                                    
	            "type": "Literal",                                                                                      
	            "value": binaryExpression.operator,
	            "raw" : "\""+binaryExpression.operator + "\""
        	},
        	binaryExpression.left,
        	binaryExpression.right
        ];

        delete binaryExpression.left;
        delete binaryExpression.right;

		counter++;
		if(counter > 100){
			console.log('Recursion Error!');
			return false;
		}
	}
}

function findAllDOMCallExpressions(ast){
	var map = new astMap(ast);
	var regex = /(CallExpression)\/callee\/MemberExpression/g;
	var search = flatten(map.find(regex));
	var results = [];

	//console.log(JSON.stringify(map.map.paths, null, 4));


	for(var i = 0; i < search.length; i++){
		var node = search[i].node;
		if(node.callee.type == "MemberExpression" && node.callee.object.type == "Identifier"
			&& node.callee.object.name == "DOM"){
			if(results.indexOf(node) == -1) results.push(node);
		}
	}

	return results;
}

function findOneBinaryExpression(ast){

	var map = new astMap(ast);
	var regex = /(BinaryExpression)/;
	var search = map.find(regex);
	var results = [];


	for(var i = 0; i < search.length; i++){
		if(results.indexOf(search[i][0].node) == -1) results.push(search[i][0].node);
	}

	return results[0];
}

function flatten(search){
	var ret = [];

	for(var i = 0; i < search.length; i++){
		for(var x = 0; x < search[i].length; x++){
			ret.push(search[i][x]);
		}
	}

	return ret;
}
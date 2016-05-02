/*
Turn all object.key to $scope.object.key
*/
var rootScopeIdentifer = "_$scope";
var escodegen = require('escodegen');

var esprima = require('esprima');
var astMap = require('./astMap.js');

module.exports = function(ast){
	return getterSetter(ast);
}

function getterSetter(ast){

	var assignmentExpresions = getAssignmentExpressions(ast);
	console.log(assignmentExpresions.length);

	for(var i = 0; i < assignmentExpresions.length; i++){
		convertAssignmentExpressionToSetter(assignmentExpresions[i]);
	}


	var memberExpressions = findAllRootMemberExpressions(ast);

	for(var i = 0; i < memberExpressions.length; i++){
		if(memberExpressions[i].object.name.substring(0, "_$scope".length) == "_$scope"){
			convertMemberExpressionToGetter(memberExpressions[i]);
		}
	}

	return ast;
}

function convertAssignmentExpressionToSetter(expression){
	expression.type = 'CallExpression';
	expression.callee = {
      "type": "Identifier",
      "name": "setValue"
    };

    if(expression.left.property.type == 'Literal'){
    	var value = expression.left.property;
    }else if(expression.left.property.type == 'Identifier'){
    	//console.log(expression.left.property.name);
    	var value = {
    		type : 'Literal',
    		value : expression.left.property.name
    	};
    }else{
    	var value = expression.left.property;
    	value.computed = true;
    }

    expression.arguments = [
    	expression.left.object,
    	value,
    	expression.right
    ];

    delete expression.left;
	delete expression.right;
}

function convertMemberExpressionToGetter(memberExpression){

	memberExpression.type = 'CallExpression';
	memberExpression.callee = {
      "type": "Identifier",
      "name": "getValue"
    };

    if(memberExpression.property.type == 'Literal'){
    	var value = memberExpression.property;
    }else if(memberExpression.property.type == 'Identifier'){
    	//console.log(memberExpression.property.name);
    	var value = {
    		type : 'Literal',
    		value : memberExpression.property.name
    	};
    }else{
    	var value = memberExpression.property;
    	value.computed = true;
    }

    memberExpression.arguments = [
		memberExpression.object,
		value
    ];

	delete memberExpression.object;
	delete memberExpression.property;
}
 

function getAssignmentExpressions(ast){
	var map = new astMap(ast);
	var regex = /(AssignmentExpression)/;
	var search = flatten(map.find(regex));
	var results = [];

	for(var i = 0; i < search.length; i++){
		var node = search[i].node;
		if(node.left.type == 'MemberExpression' && node.left.object.name.substring(0, "_$scope".length) == "_$scope") {
			if(results.indexOf(node) == -1) results.push(node);
		}
		
	}

	return results;	
}

function findAllRootMemberExpressions(ast){
	var map = new astMap(ast);
	var regex = /(MemberExpression)\/object\/Identifier/;
	var search = map.find(regex);
	var results = [];

	for(var i = 0; i < search.length; i++){
		results.push(search[i][0].node);
	}

	return results;
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
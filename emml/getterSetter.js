/*
Turn all object.key to $scope.object.key
*/
var rootScopeIdentifer = "$scope";
var escodegen = require('escodegen');

var esprima = require('esprima');
var astMap = require('./astMap.js');

module.exports = function(ast){
	return getterSetter(ast);
}

function getterSetter(ast){

	var memberExpressions = findAllRootMemberExpressions(ast);

	for(var i = 0; i < memberExpressions.length; i++){
		if(memberExpressions[i].object.name.substring(0, "_$scope".length) == "_$scope"){
			convertMemberExpressionToGetter(memberExpressions[i]);
		}
	}

	return ast;
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
    	value = memberExpression.property;
    	value.computed = true;
    }

    memberExpression.arguments = [
		memberExpression.object,
		value
    ];

	delete memberExpression.object;
	delete memberExpression.property;
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
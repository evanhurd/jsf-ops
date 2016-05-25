/*
Turn all object.key to $scope.object.key
*/
var rootScopeIdentifer = "$DocumentScope";
var escodegen = require('escodegen');

var esprima = require('esprima');
var astMap = require('./astMap.js');

module.exports = function(ast){
	return scope(ast);
}

function scope(ast){

	var ast1 = esprima.parse(`

function test(obj){
	obj.test;

	obj.test(obj);

	obj();

}
	`);

	//console.log(escodegen.generate(ast));

	var map = new astMap(ast);
	
	scopeFunctionArguments(map);
	scopeVariableDeclaration(map);
	scopeIdentifiers(map);


	return ast;
}

function scopeIdentifiers(map){
	var results = map.find(/(FunctionDeclaration|FunctionExpression).*(Identifier)/);

	for(var i = 0; i < results.length; i++){

		var scopeMe = true;
		//var scopeName = CreateOrGetScope(scope);
		var variableDeclaration = results[i][1].node;
		var scope = results[i][0].node;
		var scopeName = rootScopeIdentifer;
		var varName = variableDeclaration.name;

		var parentNode = variableDeclaration._$parent;
		var parentKey = variableDeclaration._$parentKey;
		var grandParentKey = variableDeclaration._$grandParentKey;



		if(parentNode.type == "MemberExpression" && parentKey == "property" && parentNode.computed == true){
			var scopeMe = true;
		}

		if(parentNode.type == "MemberExpression" && parentKey == "object"){
			var scopeMe = true;
		}

		if(parentNode.type == "IfStatement"){
			var scopeMe = true;
		}

		if(parentNode.type == "ConditionalExpression"){
			var scopeMe = true;
		}

		if(parentNode.type == "CallExpression" && grandParentKey == "arguments"){
			var scopeMe = true;
		}

		if(parentNode.type == "CallExpression" && parentKey == "callee"){
			var scopeMe = true;
		}

		if(parentNode.type == "FunctionDeclaration" && parentKey == "id"){
			var scopeMe = false;
		}
				
		if(parentNode.type == "FunctionDeclaration" && parentKey != "id"){

			var scopeMe = false;
		}

		if(varName == scopeName){
			var scopeMe = false;
		}

		if(scopeMe && scope.scopeVariables.indexOf(varName) >= 0){
			var scopeMe = true;
		}else{
			var scopeMe = false;
		}

		if(scopeMe == true){

			variableDeclaration.type = "MemberExpression";
			variableDeclaration.object = {
              "type": "Identifier",
              "name": scopeName
            };
            variableDeclaration.property = {
              "type": "Identifier",
              "name": varName
            };
		}

	}
}

function getIdentifierParent(expressionPath){

}


function scopeIdentifier(node){
	if(node.name == "DOM") return false;
	node.type = "MemberExpression";
	node.computed = false;
	node.object = {
		type : "Identifier",
		name : rootScopeIdentifer,
	};
	node.property ={
		type : "Identifier",
		name : node.name
	};
	node.name = undefined;
	delete node.name;
}

function scopeVariableDeclaration(map){

	var results = map.find(/(FunctionDeclaration|FunctionExpression).*(VariableDeclaration)\/declarations\/[0-9]+\/VariableDeclarator\/id\/Identifier/);

	for(var i = 0; i < results.length; i++){

		var scope = results[i][0].node;
		var variableDeclaration = results[i][1].node;

		//var scope = findRootScope(variableDeclaration);
		var scopeName = rootScopeIdentifer;



		for(var x = 0; x < variableDeclaration.declarations.length;x++){
			var declarator = variableDeclaration.declarations[x];


			var init = declarator.init || {
              "type": "Literal",
              "value": null,
              "raw": "null"
            };

			var ExpressionStatement = {
	            "type": "ExpressionStatement",
	            "expression": {
	              "type": "AssignmentExpression",
	              "operator": "=",
	              "left": {
	                "type": "MemberExpression",
	                "computed": false,
	                "object": {
	                  "type": "Identifier",
	                  "name": scopeName
	                },
	                "property": {
	                  "type": "Identifier",
	                  "name": declarator.id.name
	                }
	              },
	              "right": init
	            }
	          };

	        scope.body.body.splice(1,0,ExpressionStatement);
	        scope.scopeVariables.push(declarator.id.name);
		}

		var declarationIndex = scope.body.body.indexOf(variableDeclaration);
		scope.body.body.splice(declarationIndex,1);
	}
}

function scopeFunctionArguments(map){
	var identifers = map.find(/(FunctionDeclaration|FunctionExpression)\/params\/[0-9]+\/(Identifier)/g);

	for(var i = 0; i < identifers.length; i++){
		var scope = identifers[i][0].node;
		var identifier = identifers[i][1].node;

		//var scope = findRootScope(identifier);
		var scopeName = rootScopeIdentifer;


		var ExpressionStatement = {
            "type": "ExpressionStatement",
            "expression": {
              "type": "AssignmentExpression",
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "Identifier",
                  "name": scopeName
                },
                "property": {
                  "type": "Identifier",
                  "name": identifier.name
                }
              },
              "right": {
                "type": "Identifier",
                "name": identifier.name
              }
            }
          };

        scope.scopeVariables.push(identifier.name);
        scope.body.body.splice(1,0,ExpressionStatement);

	}
}

var scopeIdCount = 0;
function CreateOrGetScope(scope){

	return findRootScope(scope);

	if(scope._$scopeName) return scope._$scopeName;
	scopeIdCount++;

	var scopeName = "_$scope"+scopeIdCount;
	var VariableDeclaration = {
        "type": "VariableDeclaration",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": {
              "type": "Identifier",
              "name": scopeName
            },
            "init": null
          }
        ],
        "kind": "var"
      };

     scope._$scopeName = scopeName;
     scope._$scopeVariables = [];
     scope.body.body.splice(0,0,VariableDeclaration);
     return scope._$scopeName;
}

function findRootScope(node){

	var parent = node;

	while(parent.scopeName == undefined){
		if(!parent._$parent){
			throw "Fatal Error locating scope! Could not find scope.";
		}

		parent = parent._$parent;
	}

	return parent;
}
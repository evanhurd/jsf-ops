var astMap = require('./astMap.js');
var esprima = require('esprima');
var escodegen = require('escodegen');
var AstStatements = require('../AstStatements');
var types = require("ast-types");
var clone = require('clone');

module.exports = function(ast){
	return scope(ast);
}

function scope(ast){

	/*var ast1 = esprima.parse(`
		for(var i = 0; i < 10; i++){

		}
	`);

	//console.log(escodegen.generate(ast));

	
	
	scopeVariableDeclerations_IN_ForStatements(ast1);
	scopeVariableDeclerations(ast1);
	scopeGetters(ast1);
	//console.log(escodegen.generate(ast1));


	//console.log(JSON.stringify(ast1, null, 4));
	//scopeFunction(ast1);
	//scopeVariableDeclaration(map);
	//scopeIdentifiers(map);*/

	scopeSetters(ast);
	return ast;
}

function scopeSetters(ast){
	var map = new astMap(ast, {
		includeIdentifierNames: true,
		includeLiteralNames: false
	});


	var results = map.find(/(VariableDeclaration)/);
	for(var i = 0; i < results.length; i++){
		var VariableDeclaration = results[i][0].node;
		
		if(VariableDeclaration.declarations[0].id.name == AstStatements.Idents.DOCUMENTSCOPE) continue;
		
		for(var x = 0; x < VariableDeclaration.declarations.length; x++){
			var VariableDeclarator = VariableDeclaration.declarations[x];
			if(VariableDeclarator.id.name == AstStatements.Idents.DOCUMENTSCOPE) continue;
			var expression = AstStatements.ReturnScopeAssignmentExpression(VariableDeclarator.id, VariableDeclarator.init);

			if(VariableDeclaration.$parent.type == 'ForStatement'){
				VariableDeclaration.$parent.init = expression.expression;
				scopeIdentifiers(map, VariableDeclaration, VariableDeclarator.id.name);
				break;
			}else{
				var k = VariableDeclaration.$parent.indexOf(VariableDeclaration);
				VariableDeclaration.$parent.splice(k + x+1, 0,expression);
				scopeIdentifiers(map, VariableDeclaration, VariableDeclarator.id.name);
			}
			
		}
		if(VariableDeclaration.$parent.type == 'ForStatement'){

		}else{
			var k = VariableDeclaration.$parent.indexOf(VariableDeclaration);
			VariableDeclaration.$parent.splice(k, 1);
		}
	}

	

	
	map.traverse(function(node) {
        if(node.type != 'AssignmentExpression' ) return null;
        
        var AssignmentExpression = node;
        var expression = null;

		if(node.$parent && node.$parent.type == 'ForStatement') return null;

		if(AssignmentExpression.left.type == 'MemberExpression'){

			if(AssignmentExpression.left.object.name == AstStatements.Idents.DOCUMENTSCOPE) return null;

			var left = AssignmentExpression.left.object;
			var property = AssignmentExpression.left.property;
			var right = AssignmentExpression.right;
			var expression = AstStatements.ReturnScopeMemberAssignmentExpression(left, property, right);
			
		}else{
			var left = AssignmentExpression.left;
			var right = AssignmentExpression.right;
			if(left.name == AstStatements.Idents.DOCUMENTSCOPE) return null;
			var expression = AstStatements.ReturnScopeAssignmentExpression(left, right);
			scopeIdentifiers(map, AssignmentExpression, left.name);
		}

		if(expression)node.$parent[node.$key] = expression.expression;
	});
	
	
	map.traverse(function(node) {
		
		if(node.type != 'CallExpression'
			|| node.callee.type != 'MemberExpression'
			|| node.callee.object.name != '$DocumentScope'
			|| node.callee.property.name != '$defineNode') return null;
		
		//console.log(node.$parent.$parent.$parent.$parent.$parent.$parent);
        
		var properties = node.arguments[3];
		var bindValues = [];
		map.traverse(function(node) {
			if(node.type != 'CallExpression'
				|| node.callee.type != 'MemberExpression'
				|| node.callee.object.name != '$DocumentScope'
				|| node.callee.property.name != '$getValue') return null;
			
			bindValues.push({
				"type": "ArrayExpression",
				"elements": clone(node.arguments)
			});
		}, properties);
		
		if(bindValues.length == 0) return null;
	
		
		var expression = AstStatements.BindCallExpressionStatement([node.$parent], bindValues);
		node.$parent.$parent[node.$parent.$key] = expression;
		//console.log(node.$parent.$parent.$parent, node.$parent.$key);
		
		console.log(JSON.stringify(node.$parent.$parent.$parent, null, 4));
		
		return false;
		
	});

	//console.log(map.dictionary.paths);


}

function scopeIdentifiers(map, expression, name){
	var BlockStatement = expression;
		
	while(BlockStatement.$parent.type != 'FunctionDeclaration' && BlockStatement.$parent.type != 'FunctionExpression') {
		var BlockStatement = BlockStatement.$parent;
	}
	
	map.traverse(function(node) {
		
		if(node.type == 'Identifier' && node.name == name && node.$parent.type != "VariableDeclarator" && node.$parent.type != "AssignmentExpression"){
			
			node.$parent[node.$key] = AstStatements.ScopeGetExpression(name);
		}
		
	}, BlockStatement);

}

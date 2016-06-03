var astMap = require('./astMap.js');
var esprima = require('esprima');
var escodegen = require('escodegen');
var AstStatements = require('../AstStatements');
var types = require("ast-types");

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

		for(var x = 0; x < VariableDeclaration.declarations.length; x++){
			var VariableDeclarator = VariableDeclaration.declarations[x];
			if(VariableDeclarator.id.name == AstStatements.Idents.DOCUMENTSCOPE) continue;
			var expression = AstStatements.ReturnScopeAssignmentExpression(VariableDeclarator.id, VariableDeclarator.init);

			if(VariableDeclaration.$parent.type == 'ForStatement'){
				VariableDeclaration.$parent.init = expression.expression;
				break;
			}else{
				var k = VariableDeclaration.$parent.indexOf(VariableDeclaration);
				VariableDeclaration.$parent.splice(k + x+1, 0,expression);	
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
		}

		if(expression)node.$parent[node.$key] = expression.expression;
	});

	var data = {
		ExpressionStatement : null,
		CallExpression : null
	};
	map.traverse(function(node) {

        if(!data.ExpressionStatement && node.type != 'ExpressionStatement' )return null;
        if(node.type != 'ExpressionStatement' )data.ExpressionStatement = node;
        if(!data.CallExpression && node.type != 'CallExpression' )return null;
        if(node.type != 'CallExpression' )data.CallExpression = node;

        if(!data.ExpressionStatement || !data.CallExpression) return null;

        if(data.CallExpression.callee == "MemberExpression"
        	&& data.CallExpression.object.name == '$DocumentScope'
        	&& data.CallExpression.property.name == '$defineNode'){



        
        }else{
        	data.ExpressionStatement = null;
        	data.CallExpression = null;
        }
	});

	//console.log(map.dictionary.paths);


}

function getSetterIdentifiers(){

}
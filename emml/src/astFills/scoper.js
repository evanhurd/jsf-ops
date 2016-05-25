var astMap = require('./astMap.js');
var esprima = require('esprima');
var escodegen = require('escodegen');
var AstStatements = require('../AstStatements');

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
	return ast;
}

function scopeGetters(ast){
	var map = new astMap(ast, {
		includeIdentifierNames: true,
		includeLiteralNames: false
	});
	console.log(map.dictionary.paths);

	var results = map.find(/(Identifier\[name\=\$setValue\])/);
	var scopeables = [];
	
	for(var i = 0; i < results.length; i++){scopeables
		var Identifier = results[i][0].node;
		if(Identifier.$parent.type != 'MemberExpression') continue;
		var MemberExpression = Identifier.$parent;
		if(MemberExpression.object.name !== '$DocumentScope') continue;
		scopeables.push(MemberExpression.$parent.arguments[0].value);
	}

	var results = map.find(/(Literal)/);

	
	for(var i = 0; i < results.length; i++){
		var Literal = results[i][0].node;
		console.log(Literal);
		if(scopeables.indexOf(Literal.value) == -1)continue;
		//console.log(Literal.$parent.$parent);

		if(Literal.$parent.$parent.type == 'CallExpression'
			&& Literal.$parent.$parent.callee.type == 'MemberExpression'
			&& Literal.$parent.$parent.callee.object.name == "$DocumentScope"){
			continue;
		}

		var GetExpression = AstStatements.ScopeGetExpression(Literal.value);
		Literal.$parent[Literal.$key] = GetExpression;
	}
}

function scopeVariableDeclerations_IN_ForStatements(ast){
	var map = new astMap(ast);
	var results = map.find(/(ForStatement)\/init\/(VariableDeclaration)/);
	//console.log(results);
	for(var i = 0; i < results.length; i++){
		var ForStatement = results[i][0].node;
		var BodyArray = ForStatement.$parent;

		var VariableDeclaration = results[i][1].node;
		var declarations = VariableDeclaration.declarations;
		for(var x = 0; x < declarations.length; x++){
			var Declarator = declarations[x];
			var AssignmentExpression = AstStatements.ReturnScopeAssignmentExpression(Declarator.id, Declarator.init);
			BodyArray.splice(BodyArray.indexOf(ForStatement), 0, AssignmentExpression);
		}

		ForStatement.init = null;
	}
}


function scopeVariableDeclerations(ast){
	var map = new astMap(ast);
	var results = map.find(/(VariableDeclarator)/);
	//console.log(results);
	for(var i = 0; i < results.length; i++){
		var Declarator = results[i][0].node;
		var Declarators = Declarator.$parent;
		var Declaration = Declarators.$parent;
		var BodyArray = Declaration.$parent;

		var AssignmentExpression = AstStatements.ReturnScopeAssignmentExpression(Declarator.id, Declarator.init);
		BodyArray.splice(BodyArray.indexOf(Declaration) + 1, 0, AssignmentExpression);

		if(Declarators.indexOf(Declarator) >= 0)
			Declarators.splice(Declarators.indexOf(Declarator), 1);

		if(Declarators.length == 0 && BodyArray.indexOf(Declaration) >= 0)
			BodyArray.splice(BodyArray.indexOf(Declaration), 1);

		//var AssignmentExpression = AstStatements.ReturnAssignmentExpression();
		//console.log(Decleration);
	}
}

function scopeFunction(ast){
	var map = new astMap(ast);

	var results = map.find(/(FunctionDeclaration|FunctionExpression)\/params\/.*\/(Identifier)/);

	for(var i = 0; i < results.length; i++){
		var FunctionExpression = results[i][0];
		var Identifier = results[i][0];
	}

}
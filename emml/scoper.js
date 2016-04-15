var rootScopeIdentifer = "$scope";

var esprima = require('esprima');

module.exports = function(js){
	var ast = esprima.parse(js);

	scope(ast);
	console.log(JSON.stringify(ast, null, 4));
}

function scope(ast){
	var States = {
		"Default" : "Default",
		"MemberExpression" : "MemberExpression",
		"RootMemberExpression" : "RootMemberExpression",
		"LooseIdentifier" : "LooseIdentifier"

	};

	var state = States.Default;


	walker(ast, function(node, parent){
		runCase();

		function runCase(){
			switch(state){
				case States.MemberExpression :

					return null;
				case States.RootMemberExpression :
					if(node.object.name != rootScopeIdentifer) scopeIdentifier(node.object);
					reset();
					return null;

				case States.LooseIdentifier:
						scopeIdentifier(node);
						reset();
					return null;

				default :
					if(node.type == 'MemberExpression'){
						if(node.object.type == "Identifier"){
							state = States.RootMemberExpression;
							runCase();
						}
					}else if(node.type == 'Identifier' && parent.type != "MemberExpression"){
						state = States.LooseIdentifier;
						runCase();
					}
				return null;
			}
		}

		function reset(){
			state = States.Default;
		}
	})
}

function walker(ast, cb){
	
	walk(ast, null)

	function walk(child){
		for(var key in child){
			if(child[key] && child[key].type) cb(child[key], child)
			if(typeof child[key] == 'object') walk(child[key]);
		}
	}
}

function scopeIdentifier(node){
	if(node.name == "DOM") return false;
	console.log(node);
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


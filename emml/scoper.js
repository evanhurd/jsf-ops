var rootScopeIdentifer = "$scope";

var esprima = require('esprima');
var astMap = require('./astMap.js');

module.exports = function(js){

}

function scope(ast){

	var map = new astMap(ast);
	console.log(map.map);

	
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


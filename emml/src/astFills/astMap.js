
module.exports = ASTMap;

var ConfigIncludeNames = false;

function ASTMap(ast, includeNames){
	this.ast = ast;
	this.options = arguments[1] || {};
	this.dictionary = generateDictionary(ast, this.options);
}


ASTMap.prototype.find = function(reg){	
	var result = [];
	var nodesFound = [];

	for(i = 0; i < this.dictionary.paths.length; i++){
		var path = this.dictionary.paths[i];
		
		var capture = regexFind(reg, path);
		if(capture.length > 0) {
			var captureGroup = [];
			var node = null
			for(var x = 0; x < capture.length;x++){
				var node = this.getNodeByPath(capture[x].key);
				if(node && nodesFound.indexOf(node) == -1){
					captureGroup.push({
						path : capture[x].key,
						node: node
					});
					nodesFound.push(node);
				}
			}
			if(captureGroup.length > 0)result.push(captureGroup);
		}
	}
	return result;
}

ASTMap.prototype.getNodeByPath = function(path){
	/*if(path[path.length-1] == '/'){
		var path = path.slice(0, path.length-1);
	}*/
	
	if(this.dictionary.keys[path]){
		return this.dictionary.keys[path];
	}else{
		return null;
	}
}


ASTMap.prototype.getNodeBlockRootNode = function(path){
	var match = /(.+[0-9+]\/[a-z|A-Z]+)/.exec(path);
	if(match === null)return false;
	var nodePath = match[1];
	return this.getNodeByPath(nodePath);
}

function regexFind(regex, regexText ){
	regex.lastIndex = 0;
	var match = regex.exec(regexText);
	var result = [];	
	if(match) {
		var startIndex = match.index;
		for(var i = 1 ; i < match.length; i++){
			var capturePath = '';
			var capture = match[i];
			var foundIndex = regexText.indexOf(capture, startIndex);
			var toIndex = foundIndex + capture.length;
			
			result.push({
				key : regexText.slice(0, toIndex),
				capture : capture,
				startIndex : foundIndex,
				toIndex : toIndex
			});
			
			startIndex = toIndex;
		}
		
	}
	
	return result;
}



function generateDictionary(ast, options){
	
	var mapArray = [];
	var mapKeys = {};

	setProperty(ast, '$path', '');
	setProperty(ast, '$key', null);
	setProperty(ast, '$parent', null);

	var loop = function(node){

		for(var key in node){
			if(typeof node[key] == 'object' && node[key] != null){
				var type = (node.type ? node.type + '/' + key : null) || key;
				var path = node.$path + '/' + type;
				
				setProperty(node[key], '$path', path);
				setProperty(node[key], '$key', key);
				setProperty(node[key], '$parent', node);

				if(node[key].type){
					var path = path + '/' + node[key].type;
					if(options.includeIdentifierNames && node[key].type == "Identifier"){
						path += `[name=${node[key].name}]`;
					}

					if(options.includeLiteralNames && node[key].type == "Literal"){
						path += `[value=${node[key].value}]`;
					}
					if(mapArray.indexOf(path) == -1) mapArray.push(path);
					mapKeys[path] = node[key];
				}

				loop(node[key]);
			}
		}
	};
	
	loop(ast);
	
	return {
		paths : mapArray,
		keys : mapKeys
	};
}


function setProperty(obj, key, value){
	Object.defineProperty(obj, key, {
	  enumerable: false,
	  configurable: true,
	  writable: true,
	  value: value
	});
}

function getPath(node){

}
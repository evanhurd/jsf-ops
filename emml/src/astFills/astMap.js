
module.exports = ASTMap;

var ConfigIncludeNames = false;

function ASTMap(ast, includeNames){
	this.ast = ast;
	ConfigIncludeNames = includeNames || false;
	this.map = generateMap(ast);
}


ASTMap.prototype.find = function(reg){	
	var result = [];
	var nodesFound = [];

	for(i = 0; i < this.map.paths.length; i++){
		var path = this.map.paths[i];
		
		var capture = regexFind(reg, path);
		if(capture.length > 0) {
			var captureGroup = [];
			var node = null
			for(var x = 0; x < capture.length;x++){
				var node = this.getNodeByPath(capture[x].key);
				if(node && nodesFound.indexOf(node) == -1 || 1 == 1){
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
	if(path[path.length-1] == '/'){
		var path = path.slice(0, path.length-1);
	}
	
	if(this.map.keys[path]){
		return this.map.keys[path];
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



function generateMap(ast, mapArray){
	
	var mapArray = [];
	var mapKeys = {};
	
	var loop = function(mapArray, node, parentPath, parentKey, grandParentNode, grandParentKey){
		var path = parentPath;

		for(var key in node){
			
			if( key == 'type' ){

				if(new Number(parentKey) && parentKey >= 0){
					parentPath += '/' + grandParentKey;
				}

				path = parentPath + '/'+ parentKey + '/' + node[key];
				mapArray.push(path);
				mapKeys[path] = node;
			}

			
			if(parentKey == 'body' && new Number(key) && key >= 0 ){
				//path = parentPath + '/'+key;
				//mapArray.push(path);
				//mapKeys[path] = node;
			}


			if(key == 'value' && ConfigIncludeNames){
				mapArray.push(path +'[value="'+node[key]+'"]');
				mapKeys[path +'[value="'+node[key]+'"]'] = node;
			}
			if(key == 'name' && ConfigIncludeNames){
				mapArray.push(path +'[name="'+node[key]+'"]');
				mapKeys[path +'[name="'+node[key]+'"]'] = node;
			}

			if(typeof node[key] == 'object' && key !='_parent'){
				if(key.substring(0,2) != '_$') {
					loop(node[key], path, key, node, parentKey);
				}

				if(node[key]){
					if(node.length){
						node[key]._$parent = grandParentNode;
						node[key]._$parentKey = grandParentKey;
						node[key]._$grandParentKey = grandParentNode._$parentKey;
					}else{
						node[key]._$parent = node;
						node[key]._$parentKey = key;
						node[key]._$grandParentKey = parentKey;
					}
				}
			}
		}
		
	}.bind(null, mapArray);
	
	loop(ast, '', '', '');
	
	return {
		paths : mapArray,
		keys : mapKeys
	};
}

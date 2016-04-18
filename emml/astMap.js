
module.exports = ASTMap;

function ASTMap(ast){
	this.ast = ast;
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
	if(path[path.length-1] == '/'){
		var path = path.slice(0, path.length-1);
	}
	
	if(this.map.keys[path]){
		return this.map.keys[path];
	}else{
		console.log(path);
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
	
	var loop = function(mapArray, node, parentPath, parentKey){
		var path = parentPath;
		
		for(var key in node){
			
			if( key == 'type' ){
				path = parentPath + '/'+node[key];
				mapArray.push(path);
				mapKeys[path] = node;
			}

			
			if(parentKey == 'body' && new Number(key) && key >= 0 ){
				path = parentPath + '/'+key;
				mapArray.push(path);
				mapKeys[path] = node;
			}

			if(key == 'value'){
				mapArray.push(path +'[value="'+node[key]+'"]');
				mapKeys[path +'[value="'+node[key]+'"]'] = node;
			}
			if(key == 'name'){
				mapArray.push(path +'[name="'+node[key]+'"]');
				mapKeys[path +'[name="'+node[key]+'"]'] = node;
			}

			if(typeof node[key] == 'object' && key !='_parent'){
				loop(node[key], path, key);
				//if(node[key] != null) node[key]._parent = node;
			}
			
			
		}
		
	}.bind(null, mapArray);
	
	loop(ast, '', '');
	
	return {
		paths : mapArray,
		keys : mapKeys
	};
}

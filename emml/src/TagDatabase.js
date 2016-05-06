var path = require('fs'); 

module.exports = new TagDatabase();

function TagDatabase(){
	return this;
}


TagDatabase.prototype.getTag = function(tagName){
	var Tag = loadTagFromFile(tagName);
	if(!Tag){
		var Tag = loadTagFromFile('EMDEFAULTTAG');
	}
	if(!Tag){
		throw new Error('EMDEFAULTTAG tag is missing!');
	}
	return Tag;	
}

function loadTagFromFile(tagName){
	var file = './tags/'+tagName+'.js';
	if(path.existsSync(file)){
		return require(file);
	}else{
		return null;
	}
}
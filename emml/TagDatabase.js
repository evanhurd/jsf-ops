
module.exports = function(tagName){
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
	try{
		return require('./tags/'+tagName+'.js');
	}
	catch(err){
		//console.log(err);
		return null;
	}
}
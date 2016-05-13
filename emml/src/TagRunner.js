var tagDB = require('./TagDatabase');
var ParseXML = require('./ParseXML');

module.exports = TagRunner;

function TagRunner(xmlObject){
	return new Promise(function(resolve){
		resolve(runXMLNode(xmlObject));
	});
}

function runXMLNode(node){

	var Tag = tagDB.getTag(node.tagName);
	var tag = new Tag();		

	tag.xmlTag = node;
	tag.attributes = node.attributes;
	tag.jsKey = node.jsKey;
	tag.value = node.value;
	tag.tagName = node.tagName;


	for(var i = 0; i < node.children.length; i++){
		var childTag = runXMLNode(node.children[i]);
		tag.addChild(childTag);
	}

	tag.init(node);

	return tag
}
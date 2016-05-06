var tagDB = require('./TagDatabase');

module.exports = TagRunner;

function TagRunner(xmlObject){
	var tag = runXMLNode(xmlObject);
	return tag;
}

function runXMLNode(node){
	var Tag = tagDB.getTag(node.tagName);
	var tag = new Tag();		

	tag.xmlTag = node;
	tag.attributes = node.attributes;
	tag.jsKey = node.jsKey;

	for(var i = 0; i < node.children.length; i++){
		var childTag = runXMLNode(node.children[i]);
		tag.addChild(childTag);
	}

	tag.init(node);

	return tag
}
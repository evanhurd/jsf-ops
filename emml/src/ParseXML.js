var SAX = require("sax");

var TagTypes= {
	ELEMENT: 1,
	TEXT : 2,
	ROOT: 3
};

module.exports = ParseXML;

ParseXML.TagType = TagTypes;

function ParseXML(xmlString){
	var promise = new Promise(function(resolve, reject){
		var stack = [];
		var parser = SAX.parser(false);
		var rootTag = new XMLTag();
		rootTag.tagName = "SCOPE";
		rootTag.type = TagTypes.ROOT;

		parser.onerror = function (e) {
			reject(e);
		};
		parser.ontext = function (text) {
			if(text.trim()){
				var tag = new XMLTag();
				tag.type = TagTypes.TEXT;
				stack.push(tag);
			}
		};

		parser.onopentag = function (node) {
			var tag = new XMLTag();
			node.isSelfClosing = false;			
			tag.jsKey = parser.jsAttrib;		
			tag.attributes = node.attributes;
			tag.isSelfClosing = tag.isSelfClosing;
			tag.sourceLineNumber = parser.line;
			tag.tagName = node.name;

			tag.sourceColumnNumber = parser.column;
			node.tag = tag;
			stack.push(tag);
		};

		parser.onclosetag = function(){
			var tag = parser.tag.tag;
			if(tag){
				while(stack.length && stack[stack.length-1] !== tag){
					var childTag = stack.pop();
					tag.addChild(childTag);
				}
			}
		}

		parser.onend = function () {
			var tag = stack[0];
			rootTag.addChild(tag);
			resolve(rootTag);
		};
		
		parser.write(xmlString).close();

	});
	return promise;
}


function XMLTag(){
	this.tagName = null;
	this.type = 0;
	this.attributes = {};
	this.jsKey = null;
	this.children = [];
	this.parent = null;
	this.sourceLineNumber = 0;
	this.sourceColumnNumber = 0;
	this.selfClosing = false;
}

XMLTag.prototype.addChild = function(tag){
	if(!(tag instanceof XMLTag)){
		throw new Error(typeof tag + ' is not an instance of XMLTag');
	}

	tag.parent = this;
	this.children.push(tag);
	return this;
}
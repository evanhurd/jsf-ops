"use strict";

var parser = require("sax").parser(false);
var tagDB = require("../TagDatabase");

var template = `

<emeval {
	var a = 2;
	var b = 2;
}>

<emif {test >= 1}>
	Yes
<emelse {test < 0}>
	No
</emif>


`;

var stack = [];

parser.onerror = function (e) {
	console.log('Error', e);
};
parser.ontext = function (text) {
	stack.push(text);
};

parser.onopentag = function (node) {
	stack.push(node);
	var Tag = new tagDB(node);
	node.jsAttrib = parser.jsAttrib;
	node.tag = new Tag(node);
	node.tag.ontagstart();
	node.id = node.tag.id;
	node.isSelfClosing = node.tag.isSelfClosing;
};

parser.onattribute = function (attr) {
};

parser.onclosetag = function(){
	var tag = parser.tag.tag;
	if(tag){
		while(stack.length && stack[stack.length-1] !== tag){
			var node = stack.pop();
			if(typeof node == 'string'){
				tag.addTextNode(node);
			}else{
				tag.addNode(node.tag);								
			}
		}
		parser.tag.tag.ontagend();
	}
}

parser.onend = function () {

};
 
parser.write(template).close();
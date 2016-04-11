"use strict";

var parser = require("sax").parser(false);
var tagDB = require("../TagDatabase");

var template = `

<div style="display:{{'Black'}}" color="gray">
	<span></span>
	test
</div>

`;

var stack = [];

parser.onerror = function (e) {
	console.log('Error', e);
};
parser.ontext = function (text) {
	if(text.trim()){
		var Tag = new tagDB('TEXTNODE');
		var tag = new Tag(text);
		stack.push(tag);
	}
};

parser.onopentag = function (node) {
	var Tag = new tagDB(node.name);
	//node.jsAttrib = parser.jsAttrib;
	var tag = new Tag(node);
	tag.ontagstart();
	node.id = tag.id;
	node.isSelfClosing = tag.isSelfClosing;
	node.tag = tag;
	stack.push(tag);
};

parser.onattribute = function (attr) {
};

parser.onclosetag = function(){
	var tag = parser.tag.tag;
	if(tag){
		while(stack.length && stack[stack.length-1] !== tag){
			var childTag = stack.pop();
			tag.addNode(childTag);
		}
		tag.ontagend();
	}
}

parser.onend = function () {
	var tag = stack[0];
	console.log(tag.compile());
};
 
parser.write(template).close();
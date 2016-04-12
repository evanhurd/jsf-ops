"use strict";

var parser = require("sax").parser(false);
var tagDB = require("../TagDatabase");
var biteId = 0;

var template = `<div style="display:\$\{'Black'\}" color="\$\{red\}"><span>

	\$\{console.log('here')\}

</span></div>`;

var stack = [];

parser.onerror = function (e) {
	console.log('Error', e);
};
parser.ontext = function (text) {
	if(text.trim()){
		var Tag = new tagDB('TEXTNODE');
		var bite = getJSBite(text);
		var tag = new Tag(text, bite);
		stack.push(tag);
	}
};

parser.onopentag = function (node) {
	var Tag = new tagDB(node.name);
	//node.jsAttrib = parser.jsAttrib;
	node.attrBites = getAtributeBites(node.attributes);
	var tag = new Tag(node);
	tag.ontagstart();
	node.id = tag.id;
	node.isSelfClosing = tag.isSelfClosing;
	node.tag = tag;
	stack.push(tag);
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
	var raw = tag.compile();
	console.log(raw);
	
};
 
parser.write(template).close();

function getAtributeBites(attr){
	var returnValue = {};
	for(var key in attr){
		var bite = getJSBite(attr[key]);
		returnValue[key] = {
			name : key,
			bite : bite,
			raw : attr[key],
			value : "${$bite_"+bite.id+"()}"
		};
	}
	return returnValue;
}

function getJSBite(str){
	biteId++;
	var id = biteId.toString(16);

	var t, endString,
		returnString = "", i = 0, regex = /(\$\{.*?\})/g;

	while( (t = regex.exec(str)) ){
		var toIndex = t.index;
		var biteLength = t[0].length - 1;
		var jsBite = t[0].slice(2, biteLength);
		returnString += returnString.length > 0 ? "+" : "";
		returnString+= "\"" + str.slice(i, toIndex) + "\"+" + jsBite;
		var i = toIndex + biteLength + 1;
	}

	if(i < str.length - 1){
		returnString+= "+\""+str.slice(i+1)+"\"";
	}

	returnString = returnString.replace(/\s|\n|\r|\t/g, '\\s');

	return {
		js : `function $bite_${id}(){return ${returnString} }`,
		id : id
	};
}
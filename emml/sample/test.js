"use strict";
var esprima = require('esprima');
var parser = require("sax").parser(false);
var tagDB = require("../TagDatabase");
var scoper = require("../scoper.js");
var getterSetter = require("../getterSetter.js");
var binaryExpressify = require("../binaryExpressify.js");

var escodegen = require('escodegen');


var biteId = 0;

var template = `
<div>
	<var name="a" value="1 \${test}"/>
	<var name="b" value="1 \${a}"/>
	<div>\${a + b}</div>
</div>`;

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

	var ScopeTag = new tagDB('SCOPE');
	var scope = new ScopeTag({name: 'scope'});
	scope.addNode(tag);


	var raw = scope.compile();
	//console.log(raw);

	var programBody = {
	  "type": "Program",
	  "body": [
	    {
	      "type": "ExpressionStatement",
	      "expression": {
	        "type": "CallExpression",
	        "callee": raw,
	        "arguments": []
	      }
	    }
	  ],
	  "sourceType": "module"
	};

	//console.log(JSON.stringify(programBody, null, 4));
	console.log('RAW');
	console.log(escodegen.generate(programBody));
	console.log('===============');

	var ast = scoper(programBody);
	console.log('SCOPED');
	console.log(escodegen.generate(ast));
	console.log('===============');

	ast = getterSetter(ast);
	console.log('GetterSetterified');
	console.log(escodegen.generate(ast));
	console.log('===============');

	ast = binaryExpressify(ast);
	console.log('binaryExpressified');
	console.log(escodegen.generate(ast));
	console.log('===============');

	//console.log(escodegen.generate(ast));
	//var ast = esprima.parse(raw);
	//console.log(JSON.stringify(ast, null, 4))
	
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
			value : bite.js
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
		if(returnString != "") returnString+= "+";
		returnString+= "\""+str.slice(i)+"\"";
	}

	returnString = returnString.replace(/\s|\n|\r|\t/g, ' ');

	return {
		js : `${returnString}`,
		id : id
	};
}
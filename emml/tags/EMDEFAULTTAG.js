"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');
var selfClosingTags = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR"
                        , "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

class CFDEFAULTTAG extends Tag {

	init(){
		this.isSelfClosing = isTagSelfClosing(this.name);
	}

    ontagstart(){

    }

    ontagend(){

    }

    compile(){
    	var data = this.compileChildren();
    	var rawAttr = getJsonAttributes(this);
    	var ast = esprima.parse(rawAttr);
    	console.log(ast);
    	var args = ast.body[0].body[0];
    	args.concat(data.return);
    	return {
    		scope : data.scope,
	    	"return": {
		        "type": "CallExpression",
		        "callee": {
		        	"type": "MemberExpression",
		        	"computed": false,
		          	"object": {
		            	"type": "Identifier",
		            	"name": "DOM"
		          	},
		          	"property": {
		            	"type": "Identifier",
		            	"name": this.name
		         	}
		        },
		        "arguments": args
	    	}
    	};
    }
}

module.exports = CFDEFAULTTAG;


function isTagSelfClosing(tagName){
    return selfClosingTags.indexOf(tagName.toUpperCase()) >= 0 ? true : false;
}

function getJsonAttributes(tag){
	var attr = {};
	for(var key in tag.attrBites){
		attr[key] = tag.attrBites[key].value;
	}
	return stringifyAttributes(attr);
}

function getJSBites(tag){
	var bites = "";
	//console.log(tag.attrBites);
	for(var key in tag.attrBites){
		bites += tag.attrBites[key].bite.js + " ";
	}
	return bites;
}

function stringifyAttributes(obj){
	var str = "{";
	for(var key in obj){
		if(str != "{") str+=",";
		str+=key + ":" + (obj[key]);
	}
	return str + "}";
}

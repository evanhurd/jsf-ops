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

    compile(scope){

        var args = [];

    	var returns = this.compileChildren(scope);
    	var rawAttr = "(" + getJsonAttributes(this) + ")";
    	var ast = esprima.parse(rawAttr);

        if(ast.body.length > 0) args.push(ast.body[0].expression);
        if(returns.length > 0) args.push(returns[0]);
    	return {
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

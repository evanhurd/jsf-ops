"use strict";
var Tag = require("./Tag.js");
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
        return `
        	DOM.${this.name}(null, ${getJsonAttributes(this)}, ${this.compileChildren()})
        `;
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
	return JSON.stringify(attr);
}

function getJSBites(tag){
	var bites = "";
	//console.log(tag.attrBites);
	for(var key in tag.attrBites){
		bites += tag.attrBites[key].bite.js + " ";
	}
	return bites;
}
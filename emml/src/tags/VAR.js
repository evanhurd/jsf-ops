"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class VAR extends Tag {

	init(){
        this.isSelfClosing = true;
        this.value = this.node;
    }

    compile(scope){

    	var name = this.node.attributes.NAME;
    	var value = this.attrBites.VALUE.bite.js;
        var js = `var ${name} = ${value};`;
        var ast = esprima.parse(js);
        
        scope.blockStatementBody.push(ast.body[0]);
    }
}

module.exports = VAR;

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

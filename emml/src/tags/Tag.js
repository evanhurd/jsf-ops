"use strict";

var tagIdACount = 0;

class Tag {
    constructor() {

    	tagIdACount++;
    	this.id = tagIdACount;

        this.tagName = null;
        this.children = [];
        this.attributes = {};
        this.jsKey = {};
        this.parent = null;
        this.xmlNode = null;
        this.isSelfClosing = true;
    }

    init(){}

    addChild(tag){
    	if(tag.parentNode){
    		throw Error(`${tag.tagName} already has a parent!`);
    	}

    	if(!(tag instanceof Tag)){
    		throw Error(`${tag.toString()} is not an instance of Tag`);
    	}
    	tag.parent = this;
    	this.children.push(tag);
    }

    compile(){}

    compileChildren(scope){
        var astExpressions = [];
        for(var i = 0; i < this.children.length;i++){
            var expressions = this.children[i].compile();
            for(var x = 0; x < expressions.length; x++){
                astExpressions.push(expressions[x]);
            }
        }
        return astExpressions;
    }
}

module.exports = Tag;
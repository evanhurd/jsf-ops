"use strict";

var tagIdACount = 0;

class Tag {
    constructor(node) {
    	tagIdACount++;
    	this.id = tagIdACount;
    	this.node = node;
    	this.children = [];
    	this.name = node.name;
    	this.parentNode = null;
    	this.scoped = false;
    	this.init();
    }

    init(){}
    ontagstart(){}
    ontagend(){}

    addNode(tag){
    	if(tag.parentNode){
    		throw Error(`${tag.name} already has a parent!`);
    	}

    	if(!(tag instanceof Tag)){
    		throw Error(`${tag.toString()} is not an instance of Tag`);
    	}
    	tag.parentNode = this;
    	this.children.push(tag);
    }

    addTextNode(text){
    	this.children.push(text);
    }
}

module.exports = Tag; 

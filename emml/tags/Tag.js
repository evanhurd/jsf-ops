"use strict";

var tagIdACount = 0;

class Tag {
    constructor(node, bite) {
    	tagIdACount++;
    	this.id = tagIdACount;
    	this.node = node;
    	this.children = [];
    	this.name = node.name;
    	this.parentNode = null;
    	this.scoped = false;
        this.attrBites = node.attrBites;
        this.isTextTag = ( typeof node == 'string' ) ? true : false;
        this.bite = bite;
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

    compile(){}

    compileChildren(){
        var script = "";

        for(var i = 0; i < this.children.length; i++){
            script+=this.children[i].compile() + ((i !== this.children.length - 1) ? ',' : '');
        }
        
        return `
            function(){
                return [${script}]
            }
        `;
    }
}

module.exports = Tag;


function getJsBites(){
    var rejext = /\{\{(.*)\}\}/g;
}
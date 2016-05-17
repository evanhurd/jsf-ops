 "use strict";
var Tag = require("./Tag.js");
var astStatements = require('../AstStatements');
var Template = require('./Template');

var scopeIdCounter = 0;

class DOCUMENT extends Tag {

	init(){
        this.tagName = 'DOCUMENT';
        this.ownerDocument = this;
        this.defaultTemplate = null;
    }


    compile(){
        var childExpressions = this.compileChildren();
        return childExpressions;
    }

    addChild(tag){
        
        if(tag.parentNode){
            throw Error(`${tag.tagName} already has a parent!`);
        }

        if(!(tag instanceof Tag)){
            throw Error(`${tag.toString()} is not an instance of Tag`);
        }

        if((tag.tagName =='TEMPLATE')){
            tag.parent = this;
            this.children.push(tag);
        }else{
            if(this.defaultTemplate == null){
                this.defaultTemplate = new Template();
                this.defaultTemplate.attributes ={
                    NAMESPACE : this.id
                };
                this.defaultTemplate.init();
            }
            this.addChild(this.defaultTemplate);
            this.defaultTemplate.addChild(tag);
        }
    }

    getIdPrefix(){
        return "D";
    }
}

module.exports = DOCUMENT;
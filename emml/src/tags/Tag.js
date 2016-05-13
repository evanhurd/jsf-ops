"use strict";
var rightpad = require('right-padding');
var NumberConverter = require("number-converter").NumberConverter;
var numberConverter = new NumberConverter(NumberConverter.DECIMAL, NumberConverter.HEXADECIMAL)
var tagIdACount = 0;

const DOCUMENT = "D",
      ELEMENT = "E",
      TAG = "T",
      SCOPE = "S";

class Tag {
    constructor() {
    	this.id = getNextId(this.getIdPrefix());

        this.tagName = null;
        this.children = [];
        this.attributes = {};
        this.jsKey = {};
        this.parent = null;
        this.xmlNode = null;
        this.isSelfClosing = true;
        this.value = null;
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
            //console.log("COMPILING:", this.children[i].toString(), this.children[i].tagName);
            var expressions = this.children[i].compile();
            for(var x = 0; x < expressions.length; x++){
                astExpressions.push(expressions[x]);
            }
        }
        return astExpressions;
    }

    getIdPrefix(){
        return TAG;
    }

    static get TYPES() {
        return {
            DOCUMENT : DOCUMENT,
            ELEMENT : ELEMENT,
            TAG : TAG,
            SCOPE: SCOPE
        }
    }
}

module.exports = Tag;

function getNextId(prefix){
    tagIdACount++;
    var numberId = rightpad(tagIdACount, 10, 0);
    return prefix + numberConverter.convert(numberId);
}
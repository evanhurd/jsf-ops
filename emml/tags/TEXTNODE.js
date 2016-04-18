"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class TEXTNODE extends Tag {

	init(){
        this.value = this.node;
    }

    compile(){

    	console.log("("+this.bite.js+")");

    	var ast = esprima.parse("("+this.bite.js+")");
    	
        if(ast.body.length > 0){
        	return ast.body[0];
        }
    }
}

module.exports = TEXTNODE;
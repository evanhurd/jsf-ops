"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class TEXTNODE extends Tag {

	init(){
        this.value = this.node;
    }

    compile(){
    	var ast = esprima.parse("("+this.bite.js+")");
        if(ast.body.length > 0){
        	return ast.body[0].expression;
        }
    }
}

module.exports = TEXTNODE;
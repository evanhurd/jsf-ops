"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class VAR extends Tag {

	init(){
        this.isSelfClosing = true;
        this.value = this.node;
    }

    compile(scope){

    	var name = this.attributes.NAME;
    	var value = this.attributes.VALUE;
        var js = `var ${name} = \"${value}\";`;
        var ast = esprima.parse(js);
        return ast.body;
    }
}

module.exports = VAR;

"use strict";
var Tag = require("./Tag.js");
var astStatements = require('../AstStatements');

class TEXTNODE extends Tag {

	init(){
    }

    compile(){

    	this.attributes.VALUE = this.value;
    	var astExpressions = [astStatements.DefineNode(this.id, 'TEXTNODE', this.parent.id, this.attributes)];
    	return astExpressions;
    }
}

module.exports = TEXTNODE;
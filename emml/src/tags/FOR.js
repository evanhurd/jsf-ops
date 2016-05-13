"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class FORTAG extends Tag {

	init(xmlNode){
		this.tagName = "FOR";
		this.isSelfClosing = false;
	}

    ontagstart(){

    }

    ontagend(){

    }

    compile(scope){

    	var init = esprima.parse(this.attributes.INIT || "0");
        var condition = esprima.parse(this.attributes.CONDITION || "true");
        var expression = esprima.parse(this.attributes.EXPRESSION || "true")

    	var ForStatement = {
          "type": "ForStatement",
          "init": init.body[0],
          "test": condition.body[0].expression,
          "update": expression.body[0].expression,
          "body": {
            "type": "BlockStatement",
            "body": []
          }
        };
        
    	var childExpressions = this.compileChildren(scope);
    	for(var i = 0; i < childExpressions.length;i++){
    		ForStatement.body.body.push(childExpressions[i]);
    	}


    	return [ForStatement];
    }
}

module.exports = FORTAG;
"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class IFTAG extends Tag {

	init(xmlNode){
		this.tagName = xmlNode.tagName;
		this.isSelfClosing = false;
	}

    ontagstart(){

    }

    ontagend(){

    }

    compile(scope){

        this.id = this.parent.id;

    	var condition = this.attributes.CONDITION || "true";

    	var ast = esprima.parse(condition);

    	if(ast.body.length > 0){
    		var testExpression =  ast.body[0].expression;	
    	}else{
    		var testExpression =  {
	        "type": "Literal",
	        "value": true,
	        "raw": "true"
	      };
    	}
    	

    	var IfStatement = {
	      "type": "IfStatement",
	      "test": testExpression,
	      "consequent": {
	        "type": "BlockStatement",
	        "body": []
	      },
	      "alternate": null
	    };

    	var childExpressions = this.compileChildren(scope);
    	for(var i = 0; i < childExpressions.length;i++){
    		IfStatement.consequent.body.push(childExpressions[i]);
    	}


    	return [IfStatement];
    }
}

module.exports = IFTAG;
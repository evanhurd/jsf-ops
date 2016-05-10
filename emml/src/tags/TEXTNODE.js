"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class TEXTNODE extends Tag {

	init(){
    }

    compile(){

    	this.attributes.VALUE = this.value;

    	var json = JSON.stringify(this.attributes);
    	var ast = esprima.parse("(" + json + ")");

        var astExpressions = [{
        	type: "ExpressionStatement",
        	expression:{
		        "type": "CallExpression",
		        "callee": {
	            	"type": "Identifier",
	            	"name": '$defineNode'
	         	},
		        "arguments": [
					{
		            	"type": "Literal",
		            	"value": this.id,
		            	"raw": this.id
		         	},
		         	{
		            	"type": "Literal",
		            	"value": "TEXTNODE",
		            	"raw": "\"TEXTNODE\""
		         	},
		         	{
		            	"type": "Literal",
		            	"value": (this.parent) ? this.parent.id : 0,
		            	"raw" : (this.parent) ? this.parent.id : 0
		         	}
		        ]
	    	}
    	}];

    	if(ast.body.length > 0) astExpressions[0].expression.arguments.push(ast.body[0].expression);

    	return astExpressions;
    }
}

module.exports = TEXTNODE;
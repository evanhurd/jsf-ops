"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');
var selfClosingTags = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR"
                        , "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

class CFDEFAULTTAG extends Tag {

	init(xmlNode){
		this.tagName = xmlNode.tagName;
		this.isSelfClosing = isTagSelfClosing(this.tagName || '');
	}

    ontagstart(){

    }

    ontagend(){

    }

    compile(scope){

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
		            	"value": this.tagName.toString(),
		            	"raw": "\"" + this.tagName.toString() + "\""
		         	},
		         	{
		            	"type": "Literal",
		            	"value": (this.parent) ? this.parent.id : 0,
		            	"raw" : (this.parent) ? this.parent.id : 0
		         	},

		         	ast.body[0].expression
		        ]
	    	}
    	}];

    	if(ast.body.length > 0) astExpressions[0].expression.arguments.push(ast.body[0].expression);

    	var childExpressions = this.compileChildren(scope);
    	for(var i = 0; i < childExpressions.length;i++){
    		astExpressions.push(childExpressions[i]);
    	}


    	return astExpressions;
    }
}

module.exports = CFDEFAULTTAG;


function isTagSelfClosing(tagName){
    return selfClosingTags.indexOf(tagName.toUpperCase()) >= 0 ? true : false;
}

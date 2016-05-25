"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');
var astStatements = require('../AstStatements');
var selfClosingTags = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR"
                        , "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

class CFDEFAULTTAG extends Tag {

	init(xmlNode){
		this.tagName = xmlNode.tagName;
		this.isSelfClosing = isTagSelfClosing(this.tagName || '');
        this.sourceLineNumber = xmlNode.sourceLineNumber;
        this.sourceColumnNumber = xmlNode.sourceColumnNumber;

	}

    ontagstart(){

    }

    ontagend(){

    }

    compile(scope){

        var astExpressions = [astStatements.DefineNode(this.id, this.tagName.toString(), this.parent.id, this.attributes)];

    	var childExpressions = this.compileChildren(scope);
    	for(var i = 0; i < childExpressions.length;i++){
    		astExpressions.push(childExpressions[i]);
    	}

        var TryBlock = astStatements.DocumentScopeTryBlock(astExpressions, this.sourceLineNumber, this.sourceColumnNumber);

    	return [TryBlock];
    }

    getIdTag(){
        return "E";
    }
}

module.exports = CFDEFAULTTAG;


function isTagSelfClosing(tagName){
    return selfClosingTags.indexOf(tagName.toUpperCase()) >= 0 ? true : false;
}

 "use strict";
var Tag = require("./Tag.js");
var astStatements = require('../AstStatements');

var scopeIdCounter = 0;

class DOCUMENT extends Tag {

	init(){
        this.tagName = 'DOCUMENT';
        this.ownerDocument = this;
    }


    compile(){
        var childExpressions = this.compileChildren();
        var documentAst = astStatements.DefineDocument(this.id, childExpressions);
        return [documentAst];
    }

    getIdPrefix(){
        return "D";
    }
}

module.exports = DOCUMENT;
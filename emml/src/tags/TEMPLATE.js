 "use strict";
var Tag = require("./Tag.js");
var astStatements = require('../AstStatements');

class TEMPLATE extends Tag {

	init(){
        this.tagName = 'TEMPLATE';
    }

    compile(){
        var childExpressions = this.compileChildren();        
        var documentAst = astStatements.DefineDocument(this.id, childExpressions);
        return [documentAst];
    }

    getIdPrefix(){
        return "T";
    }
}

module.exports = TEMPLATE;
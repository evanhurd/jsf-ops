"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class LOOP extends Tag {

	init(){
        this.isSelfClosing = false;
    }

    compile(scope){
        var ast = esprima.parse(this.jsAttribute);
        var returns = this.compileChildren(scope);

        var statement = {
          "type": "ForStatement",
          "init": ast.body[0],
          "test": ast.body[1],
          "update": ast.body[2],
          "body": {
            "type": "BlockStatement",
            "body": returns
          }
        };
        
        scope.blockStatementBody.push(statement);
    }
}

module.exports = LOOP;


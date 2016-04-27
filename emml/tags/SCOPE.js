"use strict";
var Tag = require("./Tag.js");

class SCOPE extends Tag {

	init(){
        this.value = this.node;

        this.functionExpression = {
            "type": "FunctionExpression",
            "params": [],
            "defaults": [],
            "body": {
                "type": "BlockStatement",
                "body": []
            }
        };

        this.blockStatementBody = this.functionExpression.body.body;
    }

    compile(){

        var returnStatements = this.compileChildren(this);

        var returnStatement = {
            "type": "ReturnStatement",
            "argument": {
                "type": "ArrayExpression",
                "elements": returnStatements
            }
        };

        this.blockStatementBody.push(returnStatement);

        return this.functionExpression;
    }
}

module.exports = SCOPE;
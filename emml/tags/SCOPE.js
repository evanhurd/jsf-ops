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
                "body": [
                    {
                        "type": "BlockStatement",
                        "body": []
                    },
                    {
                        "type": "ReturnStatement",
                        "argument": {
                            "type": "ArrayExpression",
                            "elements": []
                        }
                    }
                ]
            }
        };

        this.blockStatementBody = this.functionExpression.body.body[0].body;
    }

    compile(){

        var returnStatements = this.compileChildren(this);

        this.functionExpression.body.body[1].argument.elements = returnStatements;

        return this.functionExpression;
    }
}

module.exports = SCOPE;
"use strict";
var Tag = require("./Tag.js");

class SCOPE extends Tag {

	init(){
        this.value = this.node;
    }

    compile(){

        var data = this.compileChildren();

        return {

            scope : [],
            "return": {
                "type": "FunctionExpression",
                "params": [],
                "defaults": [],
                "body": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "BlockStatement",
                            "body": data.scope
                        },
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "ArrayExpression",
                                "elements": data.return
                            }
                        }
                    ]
                }
            }
        }
    }
}

module.exports = SCOPE;
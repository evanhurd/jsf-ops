"use strict";
var Tag = require("./Tag.js");

var scopeIdCounter = 0;

class SCOPE extends Tag {

	init(){
        this.value = this.node;

        scopeIdCounter++;
        var scopeName = "_$scope"+scopeIdCounter;

        var scopeDeclaration= {
          "type": "VariableDeclaration",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "id": {
                "type": "Identifier",
                "name": scopeName
              },
              "init": {
                "type": "ObjectExpression",
                "properties": []
              }
            }
          ],
          "kind": "var"
        };

        this.functionExpression = {
            "type": "FunctionExpression",
            "params": [],
            "defaults": [],
            "body": {
                "type": "BlockStatement",
                "body": [scopeDeclaration]
            },
            "scopeName": scopeName,
            "scopeVariables" : []
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
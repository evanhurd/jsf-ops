"use strict";
var Tag = require("./Tag.js");

var scopeIdCounter = 0;

class SCOPE extends Tag {

	init(){
        this.tagName = 'SCOPE';

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

        this.expressionStatement = {
          "type": "ExpressionStatement",
          "expression": {
            "type": "CallExpression",
            "callee": {
              "type": "FunctionExpression",
              "id": null,
              "params": [],
              "defaults": [],
              "body": {
                "type": "BlockStatement",
                "body": [scopeDeclaration]
              },
              "generator": false,
              "expression": false
            },
            "arguments": []
          }
        };
    }

    compile(){

        var childExpressions = this.compileChildren();

        for(var i = 0; i < childExpressions.length;i++){
            this.expressionStatement.expression.callee.body.body.push(childExpressions[i]);
        }

        return [this.expressionStatement];
    }
}

module.exports = SCOPE;
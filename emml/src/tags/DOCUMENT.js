 "use strict";
var Tag = require("./Tag.js");

var scopeIdCounter = 0;

class DOCUMENT extends Tag {

	init(){
        this.tagName = 'DOCUMENT';
        this.ownerDocument = this;

        
        this.DocumentFunctionDeclaration = {
          "type": "FunctionDeclaration",
          "id": {
            "type": "Identifier",
            "name": this.id
          },
          "params": [],
          "defaults": [],
          "body": {
            "type": "BlockStatement",
            "body": [
              {
                "type": "VariableDeclaration",
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "id": {
                      "type": "Identifier",
                      "name": "$defineNode"
                    },
                    "init": {
                      "type": "NewExpression",
                      "callee": {
                        "type": "Identifier",
                        "name": "NodeDefiner"
                      },
                      "arguments": []
                    }
                  }
                ],
                "kind": "var"
              }
            ]
          },
          "generator": false,
          "expression": false
        };
    }

    addFunctionDeclaration(functionName, expressions){

      var FunctionDeclaration = {
                "type": "FunctionDeclaration",
                "id": {
                  "type": "Identifier",
                  "name": functionName
                },
                "params": [],
                "defaults": [],
                "body": {
                  "type": "BlockStatement",
                  "body": expressions
                },
                "generator": false,
                "expression": false
              };
      this.DocumentFunctionDeclaration.body.body.push(FunctionDeclaration);
    }

    compile(){

        var childExpressions = this.compileChildren();

        for(var i = 0; i < childExpressions.length;i++){
            this.DocumentFunctionDeclaration.body.body.push(childExpressions[i]);
        }

        return [this.DocumentFunctionDeclaration];
    }

    getIdPrefix(){
        return "D";
    }
}

module.exports = DOCUMENT;
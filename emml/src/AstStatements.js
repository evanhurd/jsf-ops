'use strict';
var esprima = require('esprima');

const Indent= {
    DEFINENODE :"$defineNode",
    DOCUMENTSCOPE : "$DocumentScope",
    DOCUMENTSCOPE_Constructor : "DocumentScope",
    DOCUMENTNODE : "DOCUMENTNODE",
    INCLUDEDOCUMENT : 'INCLUDEDOCUMENT'
}

class AstStatements {
    constructor(){

    }

    DefineTemplate(documentName, expressions){
      
    }

    DefineDocument(documentId, expressions){

        var scopeDec = {
          "type": "VariableDeclaration",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "id": {
                "type": "Identifier",
                "name": Indent.DOCUMENTSCOPE
              },
              "init": {
                "type": "NewExpression",
                "callee": {
                  "type": "Identifier",
                  "name": Indent.DOCUMENTSCOPE_Constructor
                },
                "arguments": []
              }
            }
          ],
          kind : 'var'
        };

        var rootNode = this.DefineNode(documentId, Indent.DOCUMENTNODE, null, {});


        var returnExp = this.ReturnIdentifer(Indent.DOCUMENTSCOPE);
        var childExpressions = [scopeDec, rootNode];
        for(var i = 0; i < expressions.length; i++) {
            childExpressions.push(expressions[i]);
        }
        childExpressions.push(returnExp);
        var functionDec = this.FunctionDecleration(documentId, childExpressions);

        return functionDec;
    }

    DefineNode(nodeId, nodeName, parentId, attributes){

        var expression = {
            type: "ExpressionStatement",
            expression:{
                "type": "CallExpression",
                "callee": {
                  "type": "MemberExpression",
                  "computed": false,
                  "object": {
                    "type": "Identifier",
                    "name": Indent.DOCUMENTSCOPE
                  },
                  "property": {
                    "type": "Identifier",
                    "name": Indent.DEFINENODE
                  }
                },
                "arguments": [
                    {
                    "type": "Literal",
                    "value": nodeId,
                    "raw": "\"" + nodeName + "\"" 
                    },
                    {
                    "type": "Literal",
                    "value": nodeName,
                    "raw": "\"" + nodeName + "\""
                    },
                    {
                    "type": "Literal",
                    "value": parentId,
                    "raw" : "\"" + parentId + "\""
                    }
                ]
            }
        };

        var json = JSON.stringify(attributes);
        var ast = esprima.parse("(" + json + ")");

        if(ast.body.length > 0) expression.expression.arguments.push(ast.body[0].expression);

        return expression;
    }

    IncludeDocument(nodeId, path, parentId){
      var expression = {
            type: "ExpressionStatement",
            expression:{
                "type": "CallExpression",
                "callee": {
                  "type": "MemberExpression",
                  "computed": false,
                  "object": {
                    "type": "Identifier",
                    "name": Indent.DOCUMENTSCOPE
                  },
                  "property": {
                    "type": "Identifier",
                    "name": Indent.INCLUDEDOCUMENT
                  }
                },
                "arguments": [
                    {
                    "type": "Literal",
                    "value": nodeId,
                    "raw": "\"" + nodeId + "\"" 
                    },
                    {
                    "type": "Literal",
                    "value": path,
                    "raw": "\"" + path + "\""
                    },
                    {
                    "type": "Literal",
                    "value": parentId,
                    "raw" : "\"" + parentId + "\""
                    }
                ]
            }
        };

        return expression;
    }

    FunctionDecleration(functionName, expressions){
        return {
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
    }

    ReturnIdentifer(name){
        return {
            "type": "ReturnStatement",
            "argument": {
              "type": "Identifier",
              "name": name
            }
          };
    }
}

module.exports = new AstStatements();
'use strict';
var esprima = require('esprima');

var eventAttributes = ['ONCLICK'];

const Indent= {
    DEFINENODE :"$defineNode",
    DOCUMENTSCOPE : "$DocumentScope",
    DOCUMENTSCOPE_Constructor : "DocumentScope",
    DOCUMENTNODE : "DOCUMENTNODE",
    INCLUDEDOCUMENT : 'INCLUDEDOCUMENT',
    NAMESPACE : "$NameSpace",
    TEMPLATE : "$Template",
    SETVALUE : "$setValue"
}

class AstStatements {
    constructor(){
      this.Idents = Indent;
    }

    DefineTemplate(templateID, namespace, name, expressions){

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
      

      var rootNode = this.DefineNode(templateID, Indent.DOCUMENTNODE, null, {});
      
      var childExpressions = [rootNode];
      for(var i = 0; i < expressions.length; i++) {
          childExpressions.push(expressions[i]);
      }
      var templateExpression = this.DocumentScopeTemplateExpression(childExpressions);
      var returnExp = this.ReturnIdentifer(Indent.DOCUMENTSCOPE);

      var functionDec = this.FunctionDecleration(templateID, [scopeDec, templateExpression, returnExp]);

      var epxression = {
        "type": "ExpressionStatement",
        "expression": {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
              "type": "Identifier",
              "name": Indent.DOCUMENTSCOPE_Constructor
            },
            "property": {
              "type": "Identifier",
              "name": Indent.NAMESPACE
            }
          },
          "arguments": [
            {
              "type": "Literal",
              "value": namespace,
              "raw": "'"+namespace+"'"
            },
            {
              "type": "Literal",
              "value": name,
              "raw": "'"+name+"'"
            },
            {
              "type": "Identifier",
              "name": templateID
            }
          ]
        }
      };
      return [functionDec,epxression]
    }

    DefineNode(nodeId, nodeName, parentId, attributes){

        var expression = {
          type : 'BlockStatement',
          body : [{
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
          }]
        };

        var json = JSON.stringify(attributes);
        var ast = esprima.parse("(" + json + ")");
        var ExpressionStatementCallExpression = expression.body[0];

        for(var i = 0; i < ast.body[0].expression.properties.length; i++){
          var property = ast.body[0].expression.properties[i];
          if(eventAttributes.indexOf(property.key.value) > -1 && property.value.value.trim().length > 0){
            var attrAst = esprima.parse(property.value.value.trim());
            var name = nodeId + "_" + "EVENT" + "_" + property.key.value;
            property.value = this.Identifer(name);
            var FunctionDecleration = this.FunctionDecleration(name, attrAst.body);
            expression.body.splice(0,0, FunctionDecleration);
          }
        }

        if(ast.body.length > 0) ExpressionStatementCallExpression.expression.arguments.push(ast.body[0].expression);

        return expression;
    }

    DocumentScopeTemplateExpression(expressions){
    //DocumentScope.template = function($DocumentScope){}
      return {
          "type": "ExpressionStatement",
          "expression": {
            "type": "AssignmentExpression",
            "operator": "=",
            "left": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "Identifier",
                "name": Indent.DOCUMENTSCOPE
              },
              "property": {
                "type": "Identifier",
                "name": Indent.TEMPLATE
              }
            },
            "right": {
              "type": "FunctionExpression",
              "id": null,
              "params": [
                {
                  "type": "Identifier",
                  "name": "$DocumentScope"
                }
              ],
              "defaults": [],
              "body": {
                "type": "BlockStatement",
                "body": expressions
              },
              "generator": false,
              "expression": false
            }
          }
        };
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

    Identifer(name){
      return {
        "type": "Identifier",
        "name": name
      };
    }

    Literal(name){
        return {
          "type": "Literal",
          "value": name,
          "raw": "'"+name+"'"
        }
    }

    ReturnScopeAssignmentExpression(left, right){
     
      if(left.type == 'Identifier'){
        var left = this.Literal(left.name);
      }else if(left.type == "Literal"){
        var left = this.Literal(left.name);
      }else{
        var left = this.Literal(left.toString());
      }

       var args = [left, right];

      return {
        "type": "ExpressionStatement",
        "expression": {
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
              "name": Indent.SETVALUE
            }
          },
          "arguments": args
        }
      };
    }

    ReturnScopeMemberAssignmentExpression(left, property, right){
     
      if(left.type == 'Identifier'){
        var property = this.Literal(property.name);
      }else if(property.type == "Literal"){
        var property = this.Literal(property.name);
      }else{
        var property = this.Literal(property.toString());
      }

       var args = [left, property, right];

      return {
        "type": "ExpressionStatement",
        "expression": {
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
              "name": Indent.SETVALUE
            }
          },
          "arguments": args
        }
      };
    }

    ReturnAssignmentExpression(left, right){
      return {
        "type": "ExpressionStatement",
        "expression": {
          "type": "AssignmentExpression",
          "operator": "=",
          "left": left,
          "right": right
        }
      };
    }

    ScopeGetExpression(name){
      return {
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
            "name": "$getValue"
          }
        },
        "arguments": [
          {
            "type": "Literal",
            "value": name,
            "raw": "'"+name+"'"
          }
        ]
      };
    }

    BinaryExpression(operator, left, right){
      return {
          "type": "BinaryExpression",
          "operator": operator,
          "left": left,
          "right": right
        };
    }

    DocumentScopeTryBlock(expressions, lineNumber, columnNumber){
      var lineNumber = lineNumber || 0;
      var columnNumber = columnNumber || 0;
      return {

        "type": "TryStatement",
        "block": {

          "type": "BlockStatement",
          "body": expressions
        },
        "guardedHandlers": [],
        "handlers": [
          {

            "type": "CatchClause",
            "param": {

              "type": "Identifier",
              "name": "err"
            },
            "body": {

              "type": "BlockStatement",
              "body": [
                {

                  "type": "ExpressionStatement",
                  "expression": {

                    "type": "CallExpression",
                    "callee": {

                      "type": "MemberExpression",
                      "computed": false,
                      "object": {

                        "type": "Identifier",
                        "name": "$DocumentScope"
                      },
                      "property": {

                        "type": "Identifier",
                        "name": "throw"
                      }
                    },
                    "arguments": [
                      {

                        "type": "Identifier",
                        "name": "err"
                      },
                      {

                        "type": "Literal",
                        "value": lineNumber,
                        "raw": lineNumber,
                      },
                      {

                        "type": "Literal",
                        "value": columnNumber,
                        "raw": columnNumber,
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        "handler": null,
        "finalizer": null
      }
    }
}

module.exports = new AstStatements();
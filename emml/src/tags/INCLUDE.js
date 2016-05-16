"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');

class INLCUDE extends Tag {

	init(xmlNode){
		this.tagName = "INCLUDE";
		this.isSelfClosing = true;
	}

  compile(scope){
    var template = this.attributes.TEMPLATE;

    var expression = {
        type: "ExpressionStatement",
        expression:{
          "type": "CallExpression",
          "callee": {
              "type": "Identifier",
              "name": '$defineNode'
          },
          "arguments": [
        {
                "type": "Literal",
                "value": this.id,
                "raw": this.id
            },
            {
                "type": "Literal",
                "value": this.tagName.toString(),
                "raw": "\"" + this.tagName.toString() + "\""
            },
            {
                "type": "Literal",
                "value": (this.parent) ? this.parent.id : 0,
                "raw" : (this.parent) ? this.parent.id : 0
            }
          ]
      }
    };



  }
}

module.exports = INLCUDE;


function convertToMemberExpression(str){
  var members = ("VIEW.")+ strs.split(".");

  var topMemberExpression = {
    "type": "MemberExpression",
    "computed": false,
    "object": {},
    "property": {
      "type": "Identifier",
      "name": "b"
    }
  };

  var memberExpression = topMemberExpression;

  for(var i = members.length - 1; i >= 0; i--){
    memberExpression.property.name = members[i];
    memberExpression.object = {
      "type": "MemberExpression",
      "computed": false,
      "object": {},
      "property": {
        "type": "Identifier",
        "name": "b"
      }
    };

    memberExpression = memberExpression.object;
  }

  topMemberExpression;
}
"use strict";
var Tag = require("./Tag.js");
var esprima = require('esprima');
var astStatements = require('../AstStatements');

class INLCUDE extends Tag {

	init(xmlNode){
		this.tagName = "INCLUDE";
		this.isSelfClosing = true;
    this.xmlNode = xmlNode;
	}

  compile(scope){
    var template = this.attributes.TEMPLATE;
    var expression = astStatements.IncludeDocument(this.id, template, this.parent.id);
    return [expression];
  }
}

module.exports = INLCUDE;
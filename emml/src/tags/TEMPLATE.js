 "use strict";
var Tag = require("./Tag.js");
var Document = require("./Document.js");
var astStatements = require('../AstStatements');

class TEMPLATE extends Tag {

	init(){
        this.tagName = 'TEMPLATE';
        this.test = true;
        this.namespace = this.attributes.NAMESPACE;
        if(!this.namespace){
            throw "Missing Required Attribute Namespace!";
        }
        if(!(this.parent instanceof Document)){
            //throw "Template can only be a child of Document";
        }
    }

    compile(){
        var childExpressions = this.compileChildren();
        console.log('HERE======================================');
        console.log(this.tagName, this.parent.tagName);
        //console.log(JSON.stringify(functionDec, null, 4));
        var template = astStatements.DefineTemplate(this.id,'test.test','view', childExpressions);
        return template;
    }

    getIdPrefix(){
        return "T";
    }
}

module.exports = TEMPLATE;
 "use strict";
var Tag = require("./Tag.js");
var astStatements = require('../AstStatements');

class TEMPLATE extends Tag {

	init(){
        this.tagName = 'TEMPLATE';
        this.test = true;
        this.namespace = this.attributes.NAMESPACE;
        this.name = this.attributes.NAME;

    }

    compile(){
        var Document = require("./DOCUMENT");

        if(!this.namespace){
            throw "Missing Required Attribute Namespace!";
        }
        
        if(!(this.parent && this.parent instanceof Document)){
            throw "Template can only be a child of Document";
        }

        var childExpressions = this.compileChildren();
        //console.log(JSON.stringify(functionDec, null, 4));
        var template = astStatements.DefineTemplate(this.id,this.namespace,this.name, childExpressions);
        return template;
    }

    getIdPrefix(){
        return "T";
    }
}

module.exports = TEMPLATE;
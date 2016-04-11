"use strict";
var Tag = require("./Tag.js");
var selfClosingTags = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR"
                        , "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

class CFDEFAULTTAG extends Tag {

	init(){
		this.isSelfClosing = isTagSelfClosing(this.name);
	}

    ontagstart(){

    }

    ontagend(){

    }

    compile(){
        var attrString = JSON.stringify(this.node.attributes);
        var childrenJS = this.compileChildren();
        var template = `
            DOM.${this.name}.bind(null, ${attrString}, ${childrenJS})
        `;
        return template;
    }
}

module.exports = CFDEFAULTTAG;


function isTagSelfClosing(tagName){
    return selfClosingTags.indexOf(tagName.toUpperCase()) >= 0 ? true : false;
}
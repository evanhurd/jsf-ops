"use strict";
var Tag = require("./Tag.js");

class CFDEFAULTTAG extends Tag {

	init(){
		this.isSelfClosing = false;
		console.log(this.node.jsAttrib);
	}

    ontagstart(){
    	console.log("Start", this.node);
    }

    ontagend(){
    	console.log("End", this.node.name);
    }
}

module.exports = CFDEFAULTTAG;
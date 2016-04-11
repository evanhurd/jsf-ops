"use strict";
var Tag = require("./Tag.js");

class TEXTNODE extends Tag {

	init(){
        this.value = this.node;
    }

    compile(){
        return `TextValue("${this.value}")`;
    }
}

module.exports = TEXTNODE;

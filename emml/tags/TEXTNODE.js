"use strict";
var Tag = require("./Tag.js");

class TEXTNODE extends Tag {

	init(){
        this.value = this.node;
    }

    compile(){

        return `function(){
        	${this.bite.js}
        	return $bite_${this.bite.id}();
        }`;
    }
}

module.exports = TEXTNODE;
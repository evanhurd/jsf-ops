"use strict";
var Tag = require("./Tag.js");

class VAR extends Tag {

	init(){
        this.value = this.node;
    }

    compile(){

    	var name = this.node.attributes.NAME;
    	var value = this.node.attributes.VALUE;

    	if(value){
    		return {scope:`
    			var ${name} = "${value}";
    		`};
    	}else{
			return {scope:`
    			var ${name};
    		`};
    	}
    }
}

module.exports = VAR;
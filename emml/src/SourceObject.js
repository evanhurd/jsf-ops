'use strict';
var escodegen = require('escodegen');
var scoper = require("./astFills/scoper.js");
var getterSetter = require("./astFills/getterSetter.js");
var binaryExpressify = require("./astFills/binaryExpressify.js");


class SourceObject{
	constructor(directory, files){
		this.directory = directory;
		this.files = files;

		this.sourceAst = {
		  "type": "Program",
		  "body": [
		    
		  ],
		  "sourceType": "script"
		};

	}


	compile(){
		for(var i = 0; i < this.files.length; i++){
			this.processFile(this.files[i]);
		}
        //console.log(JSON.stringify(this.sourceAst, null, 4));
       	var ast = this.sourceAst;
        //var ast = scoper(ast);
        //var ast = getterSetter(ast);
        //var ast = binaryExpressify(ast);

		var js = escodegen.generate(ast);
		return js;
	}


	processFile(file){


        //console.log(JSON.stringify(file.astTree, null, 4));

        var expressions = file.astTree.body;
        for(var i = 0; i < expressions.length; i++){
            //console.log(expressions);
            this.sourceAst.body.push(expressions[i]);
        }

	}

} 

module.exports = SourceObject;


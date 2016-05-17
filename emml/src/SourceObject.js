'use strict';
var escodegen = require('escodegen');


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
		var js = escodegen.generate(this.sourceAst);
		
		console.log(js);
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


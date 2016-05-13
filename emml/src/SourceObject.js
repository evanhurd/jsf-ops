'use strict';
var escodegen = require('escodegen');


class SourceObject{
	constructor(directory, files){
		this.directory = directory;
		this.files = files;

		this.sourceAst = {
		  "type": "Program",
		  "body": [
		    {
		      "type": "ExpressionStatement",
		      "expression": {
		        "type": "ObjectExpression",
		        "properties": []
		      }
		    }
		  ],
		  "sourceType": "script"
		};

		this.sourceAst = {
		  "type": "Program",
		  "body": [
		    {
		  
		      "type": "VariableDeclaration",
		      "declarations": [
		        {
		      
		          "type": "VariableDeclarator",
		          "id": {
		        
		            "type": "Identifier",
		            "name": "VIEW"
		          },
		          "init": {
		        
		            "type": "ObjectExpression",
		            "properties": []
		          }
		        }
		      ],
		      "kind": "var"
		    }
		  ],
		  "sourceType": "script"
		};
		this.rootObjectExpression = this.sourceAst.body[0].expression;
		this.objectFolders = {
			$_astProperties :  this.sourceAst.body[0].declarations[0].init.properties
		};
	}


	compile(){
		for(var i = 0; i < this.files.length; i++){
			this.processFile(this.files[i]);
		}

		var js = escodegen.generate(this.sourceAst);
		//console.log(JSON.stringify(this.sourceAst, null, 4));
		console.log(js);
	}


	processFile(file){
		var filePath = file.file.slice(this.directory.length, file.length);
		var paths = filePath.split('/');

		var fileName = paths.pop().split('.')[0];

		var currentFolder = this.objectFolders;
		for(var i = 0; i < paths.length; i++){
			if(paths[i].trim() == '') continue;
			var currentFolder = this.addNewFolder(currentFolder, paths[i]);
		}

		var expression = {
	        "range": [
	          8,
	          20
	        ],
	        "type": "FunctionExpression",
	        "id": null,
	        "params": [],
	        "defaults": [],
	        "body": {
	          "range": [
	            18,
	            20
	          ],
	          "type": "BlockStatement",
	          "body": file.astTree.body[0].body.body
	        },
	        "generator": false,
	        "expression": false
	      };

	    

	    //console.log(JSON.stringify(expression, null, 4));

		this.addNewFolderItem(currentFolder, fileName, expression);
	}


	addNewFolder(parent, name){
		if(parent[name] != undefined) return parent[name];

		var property = {
            "type": "Property",
            "key": {
              "type": "Literal",
              "value": name,
              "raw": "\"" + name + "\""
            },
            "computed": false,
            "value": {
              "type": "ObjectExpression",
              "properties": []
            },
            "kind": "init",
            "method": false,
            "shorthand": false
		};

		parent[name] = {
			$_astProperties : property.value.properties
		};

		parent.$_astProperties.push(property);

		return parent[name];
	}

	addNewFolderItem(parent, name, ast){

		var property = {
            "type": "Property",
            "key": {
              "type": "Literal",
              "value": name,
              "raw": "\"" + name + "\""
            },
            "computed": false,
            "value": ast,
            "kind": "init",
            "method": false,
            "shorthand": false
		};

		parent[name] = {
			$_astProperty : property,
			ast : ast,
			name : name
		};

		parent.$_astProperties.push(property);

		return parent[name]
	}

} 

module.exports = SourceObject;


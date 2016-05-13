'use strict';
var ReadFile = require('./ReadFile');
var ParseXML = require('./ParseXML');
var TagRunner = require('./TagRunner');
var Compiler = require('./Compiler');



class FileCompilerObject{
	
	constructor(file){
		this.file = file;
		this.content = null;
		this.xmlTree = null;
		this.tagTree = null;
		this.astTree = null;
		this.programCode = null;

		this.readFile = this.readFile.bind(this);
		this.parseXML = this.parseXML.bind(this);
		this.runTags = this.runTags.bind(this);
		this.compile = this.compile.bind(this);
	}


	readFile(){
		return ReadFile(this.file)
		.then(content =>{
			this.content = content;
		})
	}

	parseXML(){
		return ParseXML(this.content)
		.then(xmlTree =>{
			this.xmlTree = xmlTree;
		});
	}

	runTags(){
		return TagRunner(this.xmlTree)
		.then(tagTree =>{
			this.tagTree = tagTree;
		});
	}

	compile(){
		return Compiler(this.tagTree)
		.then(astTree =>{
			this.astTree = astTree;
		});
	}

} 
module.exports = FileCompilerObject;
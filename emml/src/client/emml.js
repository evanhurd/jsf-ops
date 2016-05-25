
function getTemplate(namespace, name){
	return DocumentScope.getTemplate(namespace, name);
}

function DocumentScope(){
	this.id = DocumentScope.scopeIdCount++;
	this.$template = null
	this.$namespace = null;
	this._currentRunInstance = null;
}

DocumentScope.prototype.$defineNode = function(nodeId, name, parentID, attributes) {
	if(this._currentExecutionInstance){
		this._currentExecutionInstance.defineNode(nodeId, name, parentID, attributes);
	}
};

DocumentScope.prototype.run = function() {
	this._currentExecutionInstance = new ExcutionInstance();
	this.$Template(this);
	var instance = this._currentExecutionInstance;
	this._currentExecutionInstance = null;
	return instance;
};

DocumentScope.prototype.throw = function(err, line, column) {
	var errorMessage = err.toString();
	throw errorMessage + " at " + this.namespace + ": " + (line + 1) + ", " + (column + 1);
};

DocumentScope.scopeIdCount = 0;
DocumentScope.NameSpaceDictionary = {};

DocumentScope.$NameSpace = function(namespace, name, template){
	if(!DocumentScope.NameSpaceDictionary[namespace]) DocumentScope.NameSpaceDictionary[namespace] = {};
	DocumentScope.NameSpaceDictionary[namespace][name] = template;
};

DocumentScope.getTemplate = function(namespace, name){
	if(!DocumentScope.NameSpaceDictionary[namespace]) return null;
	if(!DocumentScope.NameSpaceDictionary[namespace][name]) return null;
	var template = new DocumentScope.NameSpaceDictionary[namespace][name]();
	template.namespace = namespace + "." + name;
	return template;
};



function ExcutionInstance(){
	this.id = ExcutionInstance.idCounter++;
	this.nodes = {};
	this.nodeArray = [];
}

ExcutionInstance.prototype.defineNode = function(id, name, parentID, attributes){
	this.nodes[id] = new Node(id, name, parentID, attributes);
	this.nodeArray.push(this.nodes[id]);
	return this.nodes[id];
}



ExcutionInstance.idCounter = 0;

function Node(id, name, parentID, attributes){
	this.id = id;
	this.name = name;
	this.parentID = parentID;
	this.attributes = attributes;
}



function getTemplate(namespace, name){
	return DocumentScope.getTemplate(namespace, name);
}

function DocumentScope(){
	this.id = DocumentScope.scopeIdCount++;
	this.$template = null;
	this.$namespace = null;
	this.$nodes = {};
	this.renderInstanceCounter = 0;
	this.renderInstanceID = 0;
	this.elements = {};
	this.activeElements = [];
}

DocumentScope.prototype.$defineNode = function(nodeId, type, parentId, attributes) {
	this.$nodes[nodeId] = {
		type : type,
		parentId : parentId,
		attributes : attributes,
		nodeId : nodeId
	};
};

DocumentScope.prototype.run = function() {
	var elements = [];

	this.$defineNode = function(nodeId, type, parentId, attributes) {
		if(!this.$nodes[nodeId]){
			this.$nodes[nodeId] = {
				type : type,
				parentId : parentId,
				attributes : attributes,
				nodeId : nodeId
			};
		}
		elements.push(nodeId);
	}.bind(this);
	this.$Template(this);
	return elements;
};

DocumentScope.prototype.render = function(){
	var elements = this.run();
	var removedElements = [];

	var leftPatch = "";
	var rightPatch = "";

	for(var i = 0; i < this.activeElements.length; i++){
		leftPatch += this.activeElements[i] + "\n";
	}

	for(var i = 0; i < elements.length; i++){
		rightPatch += elements[i] + "\n";
	}

	var patch = getRenderPatch(leftPatch, rightPatch);
	domPatch(this.$nodes, patch);
	this.activeElements = elements;
	return this;
}

DocumentScope.prototype.attachTo = function(elementParent){
	this.elementParent = elementParent;
}

DocumentScope.prototype.getOrCreateElement = function(nodeId){
	if(!nodeId){
		return this.elementParent;
	}
	var node = this.$nodes[nodeId];
	if(this.elements[nodeId] == undefined){
		var type = node.type.toLowerCase();
		this.elements[nodeId] = createNode(node.type);
	}

	return this.elements[nodeId];
}


//============

DocumentScope.prototype.throw = function(err, line, column) {
	var errorMessage = err.toString();
	console.log('here');
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

//=================

function getRenderPatch(left,right){
	var diff = [];
	var rawDiff = JsDiff.diffLines(left, right);
	rawDiff.forEach(function(item){
		var nodes = item.value.split('\n');
		nodes.forEach(function(node){
			if( node.trim() ){
				diff.push({
					id : node,
					added : item.added,
					removed : item.removed
				});
			};
		});
	});
	return diff;
}

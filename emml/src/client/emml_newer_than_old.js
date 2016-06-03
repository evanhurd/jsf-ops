
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
	this.patches = [''];
	this.elements = {};
}

DocumentScope.prototype.$defineNode = function(nodeId, type, parentId, attributes) {
	this.$nodes[nodeId] = {
		type : type,
		parentId : parentId,
		attributes : attributes,
		nodeId : nodeId
	};
	this.patches[0] += (nodeId + "\n");
};

DocumentScope.prototype.run = function() {
	this.$Template(this);
};

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

DocumentScope.prototype.getRightPatch = function(){
	return this.patches[0];
}

DocumentScope.prototype.getLeftPatch = function(){
	return this.patches[1];
}

DocumentScope.prototype.render = function(){
	this.patches.splice(0,0,'');
	this.run();
	var patch = getRenderPatch(this.getLeftPatch(), this.getRightPatch());
	this.parsePatch(patch);
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
		//this.elements[nodeId].appendChild(document.createTextNode(nodeId));
	}
	return this.elements[nodeId];
}

DocumentScope.prototype.parsePatch = function(patch){
	var addedItems = [];
	patch.forEach(function(item){
		if(item.removed){
			console.log('here');
			var element = this.getOrCreateElement(item.nodeId);
			if(element.parentElement)element.parentElement.removeChild(element);
		}else{
			addedItems.push(item);
		}
	}.bind(this));

	for(var i = addedItems.length-1; i >= 0; i--){
		var item = addedItems[i];
		var siblingNode = null
		if(addedItems[i + 1]){
			var nextPossibleSibling = addedItems[i + 1].nodeId;
			siblingNode = this.$nodes[nextPossibleSibling];
		}
		var node = this.$nodes[item.nodeId];
		var element = this.getOrCreateElement(item.nodeId);
		if(item.added){
			var parentElement = this.getOrCreateElement(node.parentId);
			
			if(siblingNode && siblingNode.parentId == node.parentId){
				var siblingElement =  this.getOrCreateElement(siblingNode.nodeId);
				parentElement.insertBefore(element, siblingElement);
			}else{
				parentElement.appendChild(element)
			}
		}

		setElementAttributes(element, node.attributes);
	}
}

function getRenderPatch(left, right){
	var diff = [];
	var rawDiff = JsDiff.diffLines(left, right);
	rawDiff.forEach(function(item){
		var nodes = item.value.split('\n');
		nodes.forEach(function(node){
			if( node.trim() ){
				diff.push({
					nodeId : node,
					added : item.added,
					removed : item.removed
				});
			};
		});
	});
	return diff;
}


function createNode(type){
	type = type.toLowerCase();

	if(type == 'textnode'){
		return document.createTextNode('');
	}else{
		return document.createElement(type);
	}

}

function setElementAttributes(element, attributes){

	if(element.nodeType == 3){
		element.nodeValue = attributes.VALUE;
	}else{
		for(var key in attributes){
			var attr = key.toLowerCase();
			element.setAttribute(attr, attributes[key]);
		}
	}
}
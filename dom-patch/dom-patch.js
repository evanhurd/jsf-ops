function domPatch(nodes, patch){
	console.log(nodes, patch);

	domPatch.removeNodes(nodes, patch);
	domPatch.addNodes(nodes, patch);
	domPatch.updateNodes(nodes, patch);
}

domPatch.elements = {};

domPatch.removeNodes = function(nodes, patch){
	patch.forEach(function(node){
		if(node.removed) domPatch.removeNode(nodes, node.id);
	});
}

domPatch.addNodes = function(nodes, patch){
	patch.forEach(function(node, index){
		if(node.added) domPatch.addNode(nodes, node.id, patch[index - 1]);
	});
}

domPatch.updateNodes = function(nodes, patch){
	patch.forEach(function(node, index){
		if(!node.removed)domPatch.updateNode(nodes, node.id);
	});
}

domPatch.removeNode = function(nodes, nodeId){
	var node = this.getElement(nodeId);
	if(node) node.remove();
}

domPatch.addNode = function(nodes, nodeId, previousNodeId){
	var node = this.getElement(nodeId);
	if(!node) node = new domPatch.Element(nodes[nodeId]);
	node.addTo(nodes[nodeId].parentId, previousNodeId);
}

domPatch.updateNode = function(nodes, nodeId){
	var node = this.getElement(nodeId);
	if(node) node.update(nodes[nodeId].attributes);
}


domPatch.getElement = function(id){
	return this.elements[id];
}

domPatch.getParentElement = function(id){
	if(!this.elements[id]) return null;
	return this.elements[id].parentElement;
}

// ============

domPatch.Element = function(node){
	domPatch.elements[node.nodeId] = this;
	this.tag = node.type;
	this.id = node.nodeId;
	this.attributes = node.attributes;
	this.parentId = node.parentId;
	this.element = domPatch.createElement(this);
	
}

domPatch.Element.prototype.remove = function(){
	console.log('here');
	if(this.element.parentElement)
		this.element.parentElement.removeChild(this.element);
}

domPatch.Element.prototype.addTo = function(parentId, previousNodeId){
	if(this.tag == 'APPENDTO') return null;
	var parent = domPatch.getElement(parentId);
	if(!parent) return null;

	var sibling = domPatch.getElement(sibling);
	if(sibling && sibling.element.parentElement == parent.element && sibling.element.nextSibling){
		var insertMethod = "insertBefore";
		var nextSiblingElement = sibling.element.nextSibling;
	}else{
		var insertMethod = "append";
	}

	this.remove();
	if(insertMethod == "insertBefore"){
		parent.element.insertBefore(this.element, nextSiblingElement);
	}else{
		parent.element.appendChild(this.element);
	}
}

domPatch.Element.prototype.update = function(attributes){
	domPatch.setElementAttribute(this.element, attributes);
}

//=============

domPatch.setElementAttribute = function(element, attributes){
	var eventAttributes = ['onclick'];
	if(element.tagName == 'textnode'){

		element.nodeValue = attributes.VALUE;
	}else{
		for(var key in attributes){
			var attributeName = key.toLowerCase();
			console.log(attributeName);
			if(eventAttributes.indexOf(attributeName) > -1){
				element[attributeName] = attributes[key]
			}else{
				element.setAttribute(attributeName, attributes[key]);
			}
		}
	}
}


domPatch.createElement = function(node){
	var tag = node.tag.toLowerCase();
	switch(tag){
		case 'textnode':
			var element = document.createTextNode('');
			break;
		case 'appendto':
			var selectorText = node.attributes.ELEMENT;
			var element = document.querySelector(selectorText);
			node.parentId = null;
			break;
		default:
			var element = document.createElement(tag);
	}
	element.tagName = tag;
	return element;
}




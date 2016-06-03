
function getTemplate(namespace, name){
	return DocumentScope.getTemplate(namespace, name);
}

function DocumentScope(){
	this.id = DocumentScope.scopeIdCount++;
	this.$template = null;
	this.$namespace = null;
	this.$elements = {};
	this._currentExecutionInstance = null;
	this.executionInstances = [];
	this.executionInstances.push(new ExcutionInstance());
	this.rendering = RenderDocument(this, []);
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

DocumentScope.prototype.getPatchFromExecutionInstance = function(executionInstance) {
	var leftTasks = executionInstance.getTasks();
	var rightTasks = this.getLatestExecutionInstance().getTasks();
	return GenerateDiffUpdateTasks(leftTasks, rightTasks);
};

DocumentScope.prototype.getLatestExecutionInstance = function(executionInstance) {
	return this.executionInstances[this.executionInstances.length - 1];
};

DocumentScope.prototype.renderPatch = function(patch){
	return RenderDocument(this, patch);
}

DocumentScope.prototype.render = function(){
	var executionInstance = this.run();
	var patch = this.getPatchFromExecutionInstance(executionInstance);
	this.rendering = this.renderPatch(patch);
	this.executionInstances.push(executionInstance);
	this.updateParentElements();
	return this.rendering;
}

DocumentScope.prototype.attachTo = function(elementParent){
	this.elementParent = elementParent;
	this.updateParentElements();
}

DocumentScope.prototype.updateParentElements = function(){

	if(!this.elementParent) return false;
	console.log(this.rendering.elements.length);
	for(var i = 0; i < this.rendering.elements.length; i++){
		var element = this.rendering.elements[i];
		if(element.parentElement && element.parentElement != this.elementParent){
			element.parentElement.removeChild(element.parentElement);
			this.elementParent.appendChild(element);
		}else if(!element.parentElement){
			this.elementParent.appendChild(element);
		}
	}
}



function ExcutionInstance(){
	this.id = ExcutionInstance.idCounter++;
	this.nodes = {};
	this.nodeArray = [];
}

ExcutionInstance.prototype.defineNode = function(id, name, parentID, attributes){
	this.nodes[id] = new Node(id, name, parentID, attributes);
	this.nodeArray.push(this.nodes[id]);
	return this.nodes[id];
};

ExcutionInstance.prototype.getTasks = function(){
	if(this.tasks) return tasks;
	this.tasks = GenerateUpdateTasksFromExecutionInstance(this);
	return this.tasks;
}


ExcutionInstance.idCounter = 0;

function Node(id, name, parentID, attributes){
	this.id = id;
	this.name = name;
	this.parentID = parentID;
	this.attributes = attributes;
}


function GenerateDiffUpdateTasks(left,right){
	var diffTasks = [];

	for(var i = 0; i < left.length; i++){
		var leftItem = left[i];
		var rightItem = findIn(right, leftItem);

		if(rightItem == null){
			leftItem.state = "+";
		}else if(rightItem.changeId != leftItem.changeId){
			leftItem.state = "*";
		}
		diffTasks.push(leftItem);
	}

	for(var i = 0; i < right.length; i++){
		var rightItem = right[i];
		var leftItem = findIn(left, right[i]);
		if(!leftItem){
			right[i].state = '-';
			diffTasks.push(rightItem);
		}
	}


	function findIn(list, item){

		for(var i = 0; i < list.length; i++){
			var task = list[i];
			if(list[i].id == item.id){
				return i;
			} 
		}

		return null;
	}

	return diffTasks;
}


function GenerateUpdateTasksFromExecutionInstance(executionInstance){
	var updateTasks = [];
	for(var i = 0; i < executionInstance.nodeArray.length; i++){
		var leftNode = executionInstance.nodeArray[i];

		var updateItem = {
			task : 'ADD',
			nodeID : leftNode.id,
			value : leftNode.name,
			parentID : leftNode.parentID,
			state : '',
			node : leftNode
		};
		updateItem.id = updateItem.task + updateItem.nodeID + updateItem.parentID;
		updateItem.changeId = updateItem.parentID;
		updateTasks.push(updateItem);

		for(var key in leftNode.attributes){
			var updateItem = {
				task : 'SET',
				nodeID : leftNode.id,
				attribute : key,
				value : leftNode.attributes[key],
				state : '',
				node : leftNode
			};
			updateItem.id = updateItem.task + updateItem.nodeID + updateItem.attribute;
			updateItem.changeId = updateItem.value;
			updateTasks.push(updateItem);
		}
	}
	return updateTasks;
}


function RenderDocument(documentScope, patch){
	var rendering = {
		elements : [],
		patch : patch
	};
	for(var i = 0; i < patch.length; i++){
		var task = patch[i];
		if(task.task == 'ADD')runAdd(task);
		if(task.task == 'SET')runSet(task);
	}

	return rendering;



	function runAdd(task){
		if(task.state == "+"){
			var element = getOrCreateElement(task);
			var parent = getElement(task.parentID);
			if(parent){
				parent.appendChild(element);
			}else{
				rendering.elements.push(element);
			}
		}else if(task.state == '-'){
			var child = getElement(task.nodeID);
			var parent = getElement(task.parentID);
			if(child){
				if(parent){
					parent.removeChild(child);
				}else{
					var index = rendering.elements.indexOf(child);
					if(index) rendering.elements.splice(index,1);
				}
			}
		}
	}

	function runSet(task){
		var child = getElement(task.nodeID);
		if(!child) return false;
		var attribute = task.attribute.toLowerCase();

		if(task.state == "+" || task.state == "*"){
			if(task.node.name == 'TEXTNODE'){
				child.nodeValue = task.node.attributes.VALUE;
			}else{
				child.setAttribute(attribute, task.value);
			}
			
		}else if(task.state == '-'){
			if(task.node.name == 'TEXTNODE'){
				child.nodeValue = null;
			}else{
				child.removeAttribute(attribute);
			}
		}
	}

	function getOrCreateElement(task){
		var tag = task.value.toLowerCase();
		if(documentScope.$elements[task.nodeID]){
			return documentScope.$elements[task.nodeID];
		}else{
			if(tag == 'textnode'){
				documentScope.$elements[task.nodeID] = document.createTextNode('');	
			}else{
				documentScope.$elements[task.nodeID] = document.createElement(tag);	
			}
			
			return documentScope.$elements[task.nodeID];
		}
	}

	function getElement(id){
		return documentScope.$elements[id];
	}
}


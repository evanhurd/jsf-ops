
function DocumentScope(){
	this.id = DocumentScope.scopeIdCount++;
	this.renderings = [];
	this.newRendering();
}

DocumentScope.prototype.newRendering = function(){
	this.renderings.splice(0,0,[]);
	return this.getRendering();
}

DocumentScope.prototype.getRendering = function(){
	return this.renderings[0];
}


DocumentScope.prototype.$defineNode = function(nodeId, name, parentID, attributes) {
	var rendering = this.getRendering();
	rendering.push([nodeId, name, parentID, attributes]);
};



DocumentScope.scopeIdCount = 0;
DocumentScope.$NameSpace = function(){};
var keypress = require('keypress');
var util = require('util');
 
function Shell(entryScope){
	this.scopeStack = [entryScope];
	this.initStdin();
}



Shell.prototype.initStdin = function(){
	process.stdin.resume();
	process.stdin.on('data',this.onData.bind(this));
} 

Shell.prototype.onData = function(text){
	var cmd = text.toString().trim();
	this.exec(cmd);
}

Shell.prototype.write = function(text){
	process.stdout.write(cmd);
}

Shell.prototype.close = function(){

}

Shell.prototype.exit = function(){
	process.exit();
}

Shell.prototype.exec = function(cmd){
	var parts = cmd.split(" ", 1);
	switch(parts[0]){
		case "ls":
			this.listScope(parts[1])
			break;
		case "cd":
			this.currentScope(parts[1])
			break;

	}
}

Shell.prototype.listScope = function(){
	var scope = this.getCurrentScope();
	for(var key in scope) {
		
	}
}

Shell.prototype.getCurrentScope = function(){
	return this.scopeStack[this.scopeStack.length - 1];
}


var test = new Shell({});

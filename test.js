var Promise = require('promise');

var p = new Promise(function(resolve, reject){
	resolve(p2());
})
.then(function(v){
	console.log(v);
});


function p2(){
	return new Promise(function(resolve){resolve(1)}) 
}

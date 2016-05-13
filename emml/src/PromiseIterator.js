module.exports = PromiseIterator;

function PromiseIterator(handler){
	return (function(handler){

		var promise = new Promise(function(resolve, reject){
			runAgain();
			function runAgain(){
				var promise = handler();
				if(promise instanceof Promise){
					promise.then(function(data, error){
						if(error) reject();
						runAgain();
					})
					.catch(function(error){
						throw error;
					});
				}else{
					resolve(handler());
				}
			}
		})

		return promise;

	})(handler)
} 
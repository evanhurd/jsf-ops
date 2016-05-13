var SourceRunner = require('./SourceRunner');


SourceRunner('../sample')
.then(sourceObject =>{
	sourceObject.compile();
})
.catch(reportError)


function reportError(err){
	console.log(err, err.stack);
}
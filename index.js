var db = require('./models/db');
var Models = require('./models/models');
var Ops = require('./operations/ops.js');

db.sync({force:true})
.then(function(){
	run_tests();
});

function run_tests(){
	console.log('Running Tests....');
	require('./tests/money.js');
}



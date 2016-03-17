var Ops = require('../operations/ops.js');

console.log('Adding A new Money');
Ops.Money.addTransaction(1, '05/01/2005', 'test', 0, 50.04, 50.04)
.then(function(money){
	console.log(money);

	console.log('Splitting Transaction');
	Ops.Money.splitTransaction(money.id, 25)
	.then(function(newMoney, originalMoney){
		console.log(newMoney, originalMoney);
	});
})

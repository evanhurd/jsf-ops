var Models = require('../models/models.js');
var Balance = require('./balance.js');
var Category = require('./category.js');

module.exports = {
	createForcast : createForcast,
	createAllForcasts : createAllForcasts
};

function createForcast(categoryId, fromDate, toDate, avgOfLast, adjustedBy){
	return (function(categoryId, fromDate, toDate, avgOfLast, adjustedBy){
		var range = getYearMonthRange(fromDate, toDate);
		var startYear = range[0].year;
		var startMonth= range[0].month;
		var toYear = range[range.length - 1].year;
		var toMonth= range[range.length - 1].month;

		return Promise.all([
			//Balance.getCategoryBalances(categoryId),
			getMonthlyAdjustments(categoryId, new Date(adjustedBy).getFullYear()),
			Balance.getAverageOfLastFewMonths(categoryId, avgOfLast)
		])
		.then(result => {
			//var balances = createYearMonthWeekDictionaryFromBalanceRecords(result[0]);
			var adjustments = result[0];
			console.log(adjustments);
			var avgCredits = parseFloat(result[1][0].credits);
			var avgDebits = parseFloat(result[1][0].dedits);
		
			var forcastRecords = [];
			var balance = 0;



			for(var i = 0; i < range.length; i++){
				var year = range[i].year;
				var month = range[i].month;
				var credits = parseFloat(adjustments[month].credits);
				var debits = parseFloat(adjustments[month].debits);

				var forcast = {
					year : year,
					month : month,
					week : 0,
					categoryId : categoryId,
					credits : (avgCredits  * credits) != NaN ? credits : 1,
					debits : (avgDebits  * debits) != NaN ? debits : 1 
				};

				forcast.balance = balance + (forcast.credits - forcast.debits);
				balance = forcast.balance;
				//console.log(forcast);
				//console.log("balance", balance);

				forcastRecords.push(forcast);
			}

			var promiseArray = [];

			for(var i = 0; i < forcastRecords.length; i++){
				promiseArray.push(Models.BalanceForcast.create(forcastRecords[i]));
			}

			return Promise.all(promiseArray);

		})
	})(categoryId, fromDate, toDate, avgOfLast, adjustedBy);
}

function getYearMonthRange(fromDate, toDate){
	var fromDate = new Date(fromDate);
	var toDate = new Date(toDate);
	var from = {
		year : fromDate.getFullYear(),
		month : fromDate.getMonth() + 1
	};
	var to = {
		year : toDate.getFullYear(),
		month : toDate.getMonth() + 1
	};

	var yearIndex = from.year;
	var monthIndex = from.year;
	var count = 0;

	var range = [];

	for(	var yearIndex = from.year, monthIndex = from.month;
			yearIndex < to.year || (yearIndex == to.year && monthIndex <= to.month);
			monthIndex = (monthIndex % 13) +1 ){

		if(monthIndex == 13) {
			yearIndex ++;
			monthIndex = 1;
		}

		range.push({year : yearIndex, month: monthIndex});
			
		count++;
		if(count > 1500) throw new Error('Recursive Loop!');
	}

	return range;
}

function createYearMonthWeekDictionaryFromBalanceRecords(records){

	var dictionary = {};
	for(var i = 0; i < records.length;i++){
		var key = records[i].year + '-' + records[i].month + '-' + records[i].week;
		dictionary[key] = records[i];
	}

	dictionary.getRecord = function(year, month, week){
		var key = year + '-' + month + '-' + week;
		if(dictionary[key]) return dictionary[key];
		return {
			year : year,
			month : month,
			week : week,
			credits : 0,
			debits : 0,
			balance: 0,
			categoryId : 0
		}
	};

	return dictionary;

}

function getMonthlyAdjustments(categoryId, fromYear){
	return Promise.all([
		Balance.getMonthsAverage(categoryId, fromYear),
		Balance.getAverage(categoryId, fromYear)
	])
	.then(results => {
		var monthAverages = results[0];
		var average = results[1][0];

		var adjustment = {};

		for(var monthIndex = 1; monthIndex <= 12; monthIndex++){
			var month = _getRecordByMonth(monthAverages, monthIndex);
			if(month){
				var creditsAvg = (( (month.credits | 1) * 100) / (average.credits | 1)) / 100;
				var deditsAvg = (( (month.debits | 1)  * 100) / (average.debits | 1)) / 100;
				console.log(creditsAvg, deditsAvg);

				adjustment[monthIndex] = {
					credits : creditsAvg < 0 && creditsAvg > 0 ?  creditsAvg : 1,
					debits : deditsAvg < 0 && deditsAvg > 0 ?  deditsAvg : 1 
				};
			}else{
				adjustment[monthIndex] = {
					credits : average.credits | 1,
					debits : average.debits | 1
				};
			}
		}

		return new Promise(resolve => {resolve(adjustment);});
	})
}

function _getRecordByMonth(records, month){
	for(var i = 0; i < records.length; i++){
		if(records[i].month == month) return records[i];
	}
	return null;
}


function createAllForcasts(fromDate, toDate, avgOfLast, adjustedBy){
	return Category.getCategories()
	.then(categories => {

		var promiseArray = [];
		for(var i = 0; i < categories.length;i++){
			promiseArray.push(createForcast(categories[i].id, fromDate, toDate, avgOfLast, adjustedBy));
		}

		return Promise.all(promiseArray);
	})
}
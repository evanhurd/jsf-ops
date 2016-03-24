DELIMITER $$
DROP PROCEDURE IF EXISTS update_balance;
CREATE PROCEDURE update_balance (IN catId INT)
BEGIN

		SET @updateFromWeek:= 0;
		SET @updateFromYear:= 0;
	  SET @updateFromMonth:= 0;

		select
			@updateFromWeek:= week(money.date),
			@updateFromYear:= year(money.date),
			@updateFromMonth:= month(money.date)
		from money
		left outer join balances on balances.year = year(money.date)
			and balances.week = week(money.date)
			and balances.categoryId = money.categoryId
		where (balances.updatedAt < money.updatedAt or balances.id is null)
			and money.categoryId = catId
		order by money.date asc
		limit 0,1;

		IF @updateFromWeek > 0 AND @updateFromYear > 0 AND @updateFromMonth > 0 THEN

			delete from balances
			where categoryId = catId and `year` >= @updateFromYear
				and (`week` >=  @updateFromWeek OR `month` >= @updateFromMonth);

			SET @runningBalance:= 0;

			insert into balances
			(debits, credits, balance, `week`, `month`, `year`, categoryId, createdAt, updatedAt)
			select
				sum(debit) as debits,
				sum(credit) as credits,
				(@runningBalance:= (@runningBalance + sum(credit) - sum(debit))) as balance,
				WEEK(`date`) as `week`,
				0 as `month`,
				Year(`date`) as `year`,
				catId as categoryId,
				now(),
				now()
			from money
			where categoryId = catId
			Group by   WEEK(`date`), Year(`date`)
			having `week` >= @updateFromWeek and `year` >= @updateFromYear;

			SET @runningBalance:= 0;

			insert into balances
			(debits, credits, balance, `week`, `month`, `year`, categoryId, createdAt, updatedAt)
			select
				sum(debit) as debits,
				sum(credit) as credits,
				(@runningBalance := @runningBalance + (sum(credit) - sum(debit))) as balance,
				0 as `week`,
				Month(`date`) as `month`,
				Year(`date`) as `year`,
				catId as categoryId,
				now(),
				now()
			from money
			where categoryId = catId
			Group by   Month(`date`), Year(`date`)
			having `month` >= @updateFromMonth and `year` >= @updateFromYear;

		END	IF;

END$$
DELIMITER ;
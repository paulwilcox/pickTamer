create or alter procedure dbo.picOrder_list
as

select picOrderId, orderName, isDefault
from dbo.picOrder

union all 
select null, '<unordered>', 0

order by orderName
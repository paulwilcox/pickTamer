create or alter procedure dbo.picOrder_list
as

select picOrderId, orderName, isDefault
from dbo.picOrder
order by isDefault desc, orderName
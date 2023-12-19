-- marks IsSelected = true (1) under an ordering
create or alter procedure dbo.picOrderItem_select 
	@picId int,
	@picOrderId int = null
as 

if @picOrderId is null 
	set @picOrderId = (select picOrderId from dbo.picOrder where isDefault = 1)

declare 
	@picOrderItem int,
	@errMsg nvarchar(255)

select @picOrderItem = picOrderItemId 
from dbo.picOrderItem 
where picOrderId = @picOrderId
	and @picId = @picId 

if @picOrderItem is null begin
	set @errMsg = concat('picOrderItem not found (@picOrderId:', @picOrderId, ',@picId:',@picId,')')
	; throw 50000, @errMsg, 1
end 

update dbo.picOrder
set selectedItem = @picOrderItem
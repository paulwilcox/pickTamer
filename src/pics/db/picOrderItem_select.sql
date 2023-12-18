-- marks IsSelected = true (1) under an ordering
create procedure dbo.picOrderItem_select 
	@picId int,
	@picOrderId int = null
as 

if @picOrderId is null 
	set @picOrderId = (select picOrderId from dbo.picOrder where isDefault = 1)

declare @errMsg nvarchar(255)

if not exists (select 0 from dbo.picOrder where picOrderId = @picOrderId) begin
	set @errMsg = concat('picOrder with id = ', @picOrderId, ' does not exist')
	; throw 50000, @errMsg, 1
end 

if not exists (select 0 from dbo.picOrderItem where picOrderId = @picOrderId and picId = @picId)
	-- create a new item without ordering it
	insert dbo.picOrderItem (picOrderId, picId)
	values (@picOrderId, @picId)

update dbo.picOrderItem
set isSelected = iif(picId = @picId, 1, 0)
create or alter procedure dbo.pic_list
	@picOrderId int = null,
	@isOrdered bit = null
as

if @picOrderId is null 
	set @picOrderId = (select picOrderId from dbo.picOrder where isDefault = 1)

select
	p.picId,
	p.extension,
	p.description,
	p.notes,
	oi.picOrderItemId,
	oi.previousPicId,
	oi.nextPicId,
	ap.isOrdered
from dbo.pic as p
left join dbo.picOrderItem as oi
	join dbo.picOrder as o 
		on oi.picOrderId = o.picOrderId
	on p.picId = oi.picId 
	and oi.picOrderId = @picOrderId
cross apply (select 
	isOrdered = iif(oi.picOrderItemId is null,0,1)
) as ap
where ap.isOrdered = @isOrdered
	or @isOrdered is null

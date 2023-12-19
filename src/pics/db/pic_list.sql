create or alter procedure dbo.pic_list
	@picOrderId int = null -- null for unordered pics
as

select
	p.picId,
	p.extension,
	p.description,
	p.notes,
	oi.picOrderItemId,
	oi.previousPicId,
	oi.nextPicId
from dbo.pic as p
left join dbo.picOrderItem as oi
	join dbo.picOrder as o 
		on oi.picOrderId = o.picOrderId
	on p.picId = oi.picId 
where @picOrderId = oi.picOrderId
	or (@picOrderId is null and oi.picOrderId is null)

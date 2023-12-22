create or alter procedure dbo.pic_list
	@picOrderId int
as

; with ordered as (
	select picOrderItemId, nextPicId, ord = 0
	from dbo.picOrderItem
	where picOrderId = @picOrderId
	and previousPicId is null

	union all
	select nxt.picOrderItemId, nxt.nextPicId, ord = prv.ord + 1
	from ordered prv
	join dbo.picOrderItem nxt on prv.nextPicId = nxt.picId
)

select
	p.picId,
	p.extension,
	p.description,
	p.notes,
	poi.picOrderItemId,
	poi.previousPicId,
	poi.nextPicId,
	o.ord
from dbo.picOrderItem poi
join dbo.pic as p on p.picId = poi.picId 
join dbo.picOrder as po on poi.picOrderId = po.picOrderId
join ordered o on poi.picOrderItemId = o.picOrderItemId
where @picOrderId = poi.picOrderId
order by ord
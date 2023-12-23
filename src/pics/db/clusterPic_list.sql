create or alter procedure dbo.clusterPic_list
	@clusterId int
as

; with ordered as (
	select clusterPicId, nextPicId, ord = 0
	from dbo.clusterPic
	where clusterId = @clusterId
	and previousPicId is null

	union all
	select nxt.clusterPicId, nxt.nextPicId, ord = prv.ord + 1
	from ordered prv
	join dbo.clusterPic nxt on prv.nextPicId = nxt.picId
	where nxt.clusterId = @clusterId
)

select
	p.picId,
	p.extension,
	p.description,
	p.notes,
	poi.clusterPicId,
	poi.previousPicId,
	poi.nextPicId,
	o.ord
from dbo.clusterPic poi
join dbo.pic as p on p.picId = poi.picId 
join dbo.cluster as po on poi.clusterId = po.clusterId
join ordered o on poi.clusterPicId = o.clusterPicId
where @clusterId = poi.clusterId
order by ord
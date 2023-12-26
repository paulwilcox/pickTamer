create or alter procedure dbo.clusterPic_list
	@clusterId int
as

select
	cp.clusterId,
	p.picId,
	p.extension,
	p.label,
	p.description,
	p.notes,
	cp.clusterPicId,
	cp.ord
from dbo.clusterPic cp
join dbo.pic as p on p.picId = cp.picId 
join dbo.cluster as po on cp.clusterId = po.clusterId
where @clusterId = cp.clusterId
order by ord
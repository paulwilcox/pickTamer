create or alter procedure dbo.pic_deorphan 
as 

declare @defaultCluster table (clusterId int, lastClusterPicOrd int)
insert @defaultCluster
select c.clusterId, isnull(max(cp.ord),-1)
from dbo.cluster c
left join dbo.clusterPic cp on c.clusterId = cp.clusterId
where c.isDefault = 1
group by c.clusterId

insert dbo.clusterPic(clusterId, picId, ord)
select 
	c.clusterId, 
	p.picId, 
	c.lastClusterPicOrd + row_number() over(order by p.picId)
from dbo.pic p
cross join @defaultCluster c 
where not exists (
	select 1
	from dbo.clusterPic cp
	where cp.picId = p.picId
)
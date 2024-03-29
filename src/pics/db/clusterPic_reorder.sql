create or alter procedure dbo.clusterPic_reorder
	@clusterId int = 1,
  @picIdCsv nvarchar(max) = '7,9,15,25'
as

-- PARSE THE PICIDS (KEEP IT ORDER SENSITIVE)

declare @orderedPics table (picId int, ord int)
insert @orderedPics 
select val, min(id) 
from dbo.stringSplit(',',@picIdCsv)
where trim(val) <> ''
group by val

-- REORDER THE CLUSTER'S PICS (INSERT/DELETE AS NECESSARY)

declare @output table (deletedPicId int, deletedOrd int)

;with _target as (
	select *
	from dbo.clusterPic
	where clusterId = @clusterId
)
merge _target t
using @orderedPics s
	on t.picId = s.picId
when matched then 
	update set t.ord = s.ord
when not matched then 
	insert (clusterId, picId, ord)
	values (@clusterId, s.picId, s.ord)
when not matched by source then 
	delete
output deleted.picId, deleted.ord into @output;

-- GIVE ORPHANED PICS TO THE DEFAULT CLUSTER

declare @defaultCluster table (clusterId int, lastClusterPicOrd int)
insert @defaultCluster
select c.clusterId, isnull(max(cp.ord),-1)
from dbo.cluster c
left join dbo.clusterPic cp on c.clusterId = cp.clusterId
where c.isDefault = 1
group by c.clusterId

insert dbo.clusterPic (clusterId, picId, ord)
select 
	c.clusterId, 
	o.deletedPicId,
	c.lastClusterPicOrd + row_number() over(order by o.deletedOrd)
from @output as o
cross join @defaultCluster as c
where not exists (
	select 1
	from dbo.clusterPic cp
	where cp.picId = o.deletedPicId
)
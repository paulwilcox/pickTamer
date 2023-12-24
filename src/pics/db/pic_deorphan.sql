create or alter procedure dbo.pic_deorphan 
  @picId int
as 

-- if pic has a cluster anywhere, early exit
if exists (
  select 1
  from dbo.clusterPic
  where picId = @picId
)
  return

declare @defaultClusterId int = (
  select clusterId 
  from dbo.cluster
  where isDefault = 1
)

exec dbo.clusterPic_upsert
  @defaultClusterId,
  @picId,
  null -- pic to move before (i.e. move to end)


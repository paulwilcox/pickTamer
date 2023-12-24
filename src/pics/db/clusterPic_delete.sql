 
create or alter procedure dbo.clusterPic_delete 
	@clusterId int, 
	@picId int
as 

begin try
	begin transaction

	-- If pic already exists, we have to link the next pic with the (newly) previous one.
	-- Lookahead (to identify), then look back twice (to relink)
	update nextPoi 
		set nextPoi.previousPicId = poiToMove.previousPicId
	from dbo.clusterPic nextPoi
	join dbo.clusterPic poiToMove 
		on poiToMove.clusterId = nextPoi.clusterId
		and poiToMove.nextPicId = nextPoi.picId
	where poiToMove.clusterId = @clusterId
		and poiToMove.picId = @picId

	-- If pic already exists, we have to link the previous pic with the (newly) next one.
	-- Lookbehind (to identify), then look ahead twice (to relink)
	update prevPoi
		set prevPoi.nextPicId = poiToMove.nextPicId
	from dbo.clusterPic prevPoi
	join dbo.clusterPic poiToMove 
		on poiToMove.clusterId = prevPoi.clusterId
		and poiToMove.previousPicId = prevPoi.picId
	where poiToMove.clusterId = @clusterId
		and poiToMove.picId = @picId

	-- do the delete
	delete dbo.clusterPic
	where clusterId = @clusterId
		and picId = @picId

	commit
end try
begin catch
	rollback
	;throw
end catch
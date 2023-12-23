 
create or alter procedure dbo.picOrderItem_delete 
	@picOrderId int, 
	@picId int
as 

begin try
	begin transaction

	-- If pic already exists, we have to link the next pic with the (newly) previous one.
	-- Lookahead (to identify), then look back twice (to relink)
	update nextPoi 
		set nextPoi.previousPicId = poiToMove.previousPicId
	from dbo.picOrderItem nextPoi
	join dbo.picOrderItem poiToMove 
		on poiToMove.picOrderId = nextPoi.picOrderId
		and poiToMove.nextPicId = nextPoi.picId
	where poiToMove.picOrderId = @picOrderId
		and poiToMove.picId = @picId

	-- If pic already exists, we have to link the previous pic with the (newly) next one.
	-- Lookbehind (to identify), then look ahead twice (to relink)
	update prevPoi
		set prevPoi.nextPicId = poiToMove.nextPicId
	from dbo.picOrderItem prevPoi
	join dbo.picOrderItem poiToMove 
		on poiToMove.picOrderId = prevPoi.picOrderId
		and poiToMove.previousPicId = prevPoi.picId
	where poiToMove.picOrderId = @picOrderId
		and poiToMove.picId = @picId

	delete dbo.picOrderItem
	where picOrderId = @picOrderId
		and picId = @picId

	commit
end try
begin catch
	rollback
	;throw
end catch
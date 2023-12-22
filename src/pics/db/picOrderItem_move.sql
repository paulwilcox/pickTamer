create or alter procedure dbo.picOrderItem_move
	@picOrderId int = 1,
    @picToMoveId int = 15,
	@moveAfterPicId int = 9
as

declare @msg nvarchar(max)

if @moveAfterPicId is not null and not exists (
	select 0 
	from dbo.picOrderItem 
	where picOrderId = @picOrderId
	and picId = @moveAfterPicId
) begin
	set @msg = concat(
		'@moveAfterPicId = ', @moveAfterPicId, ' ',
		'not found for @picOrderId = ', @picOrderId
	)
	; throw 50000, @msg, 1
end 

begin try
	begin transaction

	-- REMOVE EXISTING RECORD FROM ORDER (OR CREATE UNORDERED RECORD)

	-- If pic-to-move already exists, we have to link the next pic with the (newly) previous one.
	-- Lookahead (to identify), then look back twice (to relink)
	update nextPoi 
		set nextPoi.previousPicId = poiToMove.previousPicId
	from dbo.picOrderItem nextPoi
	join dbo.picOrderItem poiToMove 
		on poiToMove.picOrderId = nextPoi.picOrderId
		and poiToMove.nextPicId = nextPoi.picId
	where poiToMove.picOrderId = @picOrderId
		and poiToMove.picId = @picToMoveId

	-- If pic-to-move already exists, we have to link the previous pic with the (newly) next one.
	-- Lookbehind (to identify), then look ahead twice (to relink)
	update prevPoi
		set prevPoi.nextPicId = poiToMove.nextPicId
	from dbo.picOrderItem prevPoi
	join dbo.picOrderItem poiToMove 
		on poiToMove.picOrderId = prevPoi.picOrderId
		and poiToMove.previousPicId = prevPoi.picId
	where poiToMove.picOrderId = @picOrderId
		and poiToMove.picId = @picToMoveId

-- CREATE THE NEW RECORD IF NEEDED

	if not exists (
		select 0 
		from dbo.picOrderItem 
		where picOrderId = @picOrderId
		and picId = @picToMoveId
	)
		insert dbo.picOrderItem (picOrderId, picId, previousPicId, nextPicId)
		values (@picOrderId, @picToMoveId, null, null);
		
-- GIVE THE RECORD IT'S NEW PLACEMENT

	declare @moveBeforePicId int 
	if @moveAfterPicId is not null
		select @moveBeforePicId = prevPoi.nextPicId
		from dbo.picOrderItem prevPoi
		where prevPoi.picOrderId = @picOrderId
			and prevPoi.picId = @moveAfterPicId
	else -- select the first picId (if not the new one you just inserted)
		select @moveBeforePicId = picId
		from dbo.picOrderItem as poi
		where poi.picOrderId = @picOrderId
			and poi.previousPicId is null
			and poi.picId <> @picToMoveId
		
	update dbo.picOrderItem 
		set nextPicId = @picToMoveId 
	where picOrderId = @picOrderId 
		and picId = @moveAfterPicId
	
	update dbo.picOrderItem 
		set previousPicId = @picToMoveId 
	where picOrderId = @picOrderId 
		and picId = @moveBeforePicId
	
	update dbo.picOrderItem set
		previousPicId = @moveAfterPicId, 
		nextPicId = @moveBeforePicId
	where picOrderId = @picOrderId
		and picId = @picToMoveId

	commit

end try
begin catch
	rollback
	;throw
end catch

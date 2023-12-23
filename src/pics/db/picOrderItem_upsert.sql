create or alter procedure dbo.picOrderItem_upsert
	@picOrderId int = 1,
    @picId int = 15,
	@picToMoveAfterId int = 9
as

declare @msg nvarchar(max)

if @picToMoveAfterId is not null and not exists (
	select 0 
	from dbo.picOrderItem 
	where picOrderId = @picOrderId
	and picId = @picToMoveAfterId
) begin
	set @msg = concat(
		'@picToMoveAfterId = ', @picToMoveAfterId, ' ',
		'not found for @picOrderId = ', @picOrderId
	)
	; throw 50000, @msg, 1
end 

begin try
	begin transaction

	-- REMOVE EXISTING RECORD FROM ORDER 

	exec dbo.picOrderItem_delete 
		@picOrderId, 
		@picId

	-- CREATE THE NEW RECORD IF NEEDED

	if not exists (
		select 0 
		from dbo.picOrderItem 
		where picOrderId = @picOrderId
		and picId = @picId
	)
		insert dbo.picOrderItem (picOrderId, picId, previousPicId, nextPicId)
		values (@picOrderId, @picId, null, null);
		
	-- GIVE THE RECORD IT'S NEW PLACEMENT

	declare @picToMoveBeforeId int 
	if @picToMoveAfterId is not null
		select @picToMoveBeforeId = prevPoi.nextPicId
		from dbo.picOrderItem prevPoi
		where prevPoi.picOrderId = @picOrderId
			and prevPoi.picId = @picToMoveAfterId
	else -- select the first picId (if not the new one you just inserted)
		select @picToMoveBeforeId = picId
		from dbo.picOrderItem as poi
		where poi.picOrderId = @picOrderId
			and poi.previousPicId is null
			and poi.picId <> @picId
		
	update dbo.picOrderItem 
		set nextPicId = @picId 
	where picOrderId = @picOrderId 
		and picId = @picToMoveAfterId
	
	update dbo.picOrderItem 
		set previousPicId = @picId 
	where picOrderId = @picOrderId 
		and picId = @picToMoveBeforeId
	
	update dbo.picOrderItem set
		previousPicId = @picToMoveAfterId, 
		nextPicId = @picToMoveBeforeId
	where picOrderId = @picOrderId
		and picId = @picId

	commit

end try
begin catch
	rollback
	;throw
end catch

create or alter procedure dbo.clusterPic_upsert
	@clusterId int = 1,
    @picId int = 15,
	@picToMoveAfterId int = 9
as

declare @msg nvarchar(max)

if @picToMoveAfterId is not null and not exists (
	select 0 
	from dbo.clusterPic 
	where clusterId = @clusterId
	and picId = @picToMoveAfterId
) begin
	set @msg = concat(
		'@picToMoveAfterId = ', @picToMoveAfterId, ' ',
		'not found for @clusterId = ', @clusterId
	)
	; throw 50000, @msg, 1
end 

begin try
	begin transaction

	-- REMOVE EXISTING RECORD FROM ORDER 

	exec dbo.clusterPic_delete 
		@clusterId, 
		@picId

	-- CREATE THE NEW RECORD IF NEEDED

	if not exists (
		select 0 
		from dbo.clusterPic 
		where clusterId = @clusterId
		and picId = @picId
	)
		insert dbo.clusterPic (clusterId, picId, previousPicId, nextPicId)
		values (@clusterId, @picId, null, null);
		
	-- GIVE THE RECORD IT'S NEW PLACEMENT

	declare @picToMoveBeforeId int 
	if @picToMoveAfterId is not null
		select @picToMoveBeforeId = prevPoi.nextPicId
		from dbo.clusterPic prevPoi
		where prevPoi.clusterId = @clusterId
			and prevPoi.picId = @picToMoveAfterId
	else -- select the first picId (if not the new one you just inserted)
		select @picToMoveBeforeId = picId
		from dbo.clusterPic as poi
		where poi.clusterId = @clusterId
			and poi.previousPicId is null
			and poi.picId <> @picId
		
	update dbo.clusterPic 
		set nextPicId = @picId 
	where clusterId = @clusterId 
		and picId = @picToMoveAfterId
	
	update dbo.clusterPic 
		set previousPicId = @picId 
	where clusterId = @clusterId 
		and picId = @picToMoveBeforeId
	
	update dbo.clusterPic set
		previousPicId = @picToMoveAfterId, 
		nextPicId = @picToMoveBeforeId
	where clusterId = @clusterId
		and picId = @picId

	commit

end try
begin catch
	rollback
	;throw
end catch


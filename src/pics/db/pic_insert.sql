create or alter procedure dbo.pic_insert
	@extension nvarchar(15), 
	@source nvarchar(4000),
	@sourceShort nvarchar(50),
	@description nvarchar(255), 
	@notes nvarchar(255)
as

if isnull(@source,'') = '' throw 50000, '@source cannot be blank or null', 1;
if isnull(@sourceShort,'') = '' throw 50000, '@sourceShort cannot be blank or null', 1;
if isnull(@extension,'') = '' throw 50000, '@extension cannot be blank or null', 1;
if trim(@description) = '' set @description = null 
if trim(@notes) = '' set @notes = null 

begin try
	
	begin transaction

	declare @insertedPicTable table (picId int)

	insert dbo.pic (extension, description, notes)
	output inserted.picId into @insertedPicTable
	values (@extension, @description, @notes)

	declare @insertedPicId int = (select picId from @insertedPicTable)
	declare @defaultPicOrderId int = (select picOrderId from dbo.picOrder where isDefault = 1)
	declare @tailPicOrderItemId int = (select picOrderItemId from dbo.picOrderItem where picOrderId = @defaultPicOrderId)

	insert dbo.picOrderItem (picId, picOrderId, previousPicId)
	values (
		@insertedPicId,
		@defaultPicOrderId,
		@tailPicOrderItemId
	)

	update dbo.picOrderItem
	set nextPicId = @insertedPicId
	where picOrderItemId = @tailPicOrderItemId 

	insert dbo.picSource (picId, source, sourceShort)
	values (@insertedPicId, @source, @sourceShort)

	commit

	select @insertedPicId as picId

end try 
begin catch
	rollback
	;throw
end catch

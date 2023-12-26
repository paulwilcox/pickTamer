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
		@insertedPicId,
		c.lastClusterPicOrd + 1
	from @defaultCluster as c

	commit

	select @insertedPicId as picId

end try 
begin catch
	rollback
	;throw
end catch

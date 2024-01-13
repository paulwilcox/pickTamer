-- this one is presently run manually when desired
create or alter procedure dbo.picHash_generateAll
	@algorithm nvarchar(50) = 'SHA2_256',
	@basePath nvarchar(max) = 'p:\picsToTame'
as

-- initializations

	set nocount on

-- get pics needing hash generation

	declare @sql nvarchar(max) = '
		select picId, extension
		from dbo.pic
		where not exists (
			select 0
			from dbo.picHash h
			where pic.picId = h.picId
			and h.@algorithm is not null 
		)
	'
	set @sql = replace(@sql, '@algorithm', @algorithm)

	declare @pic table (
		id int identity(1,1),
		picId int,
		extension nvarchar(50)
	)
	insert @pic
	exec (@sql)

-- loop to generate the hash

	declare 
		@id int = 0,
		@lastId int = (select max(id) from @pic)

	while @id < @lastId begin

		set @id += 1
		declare @picId int 
		declare @extension nvarchar(50)
	
		select
			@picId = picId,
			@extension = extension
		from @pic
		where id = @id

		exec dbo.picHash_generate
			@algorithm,
			@basePath,
			@picId,
			@extension

		 declare @msg nvarchar(50) = concat(@id,' of ', @lastId, ' complete')
		 raiserror(@msg, 0,0) with nowait

	end
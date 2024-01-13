create or alter procedure dbo.picHash_generate
	@algorithm nvarchar(50) = 'SHA2_256',
	@basePath nvarchar(max) = 'p:\picsToTame',
	@picId int = '6',
	@extension nvarchar(50) = 'jpg'
as

if not exists (
	select 1 
	from information_schema.columns c
	where c.table_schema = 'dbo'
		and c.table_name = 'picHash'
		and c.column_name = @algorithm
		and c.column_name <> 'picId'
)
	throw 50000, 'picHash algorithm not supported', 1

declare @sql nvarchar(max) = '
	merge dbo.picHash t
	using (
		select 
			picId = @picId,
			hashVal = hashbytes(''@algorithm'', bulkcolumn)
		from openrowset(bulk ''@basePath\@picId.@extension'', single_blob) img
	) s
		on s.picId = t.picId
	when matched then
		update set
		@algorithm = hashVal
	when not matched then 
		insert (picId, @algorithm)
		values (picId, hashVal);
'
set @sql = replace(@sql, '@algorithm', @algorithm)
set @sql = replace(@sql, '@basePath', @basePath)
set @sql = replace(@sql, '@picId', @picId)
set @sql = replace(@sql, '@extension', @extension)

exec (@sql)
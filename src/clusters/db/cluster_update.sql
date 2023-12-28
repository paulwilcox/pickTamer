create or alter procedure dbo.cluster_update
	@clusterId int,
	@clusterName nvarchar(100)
as

update dbo.cluster
set clusterName = @clusterName
where clusterId = @clusterId

if @@ROWCOUNT = 0 begin
	declare @msg nvarchar(max) = concat(
		'Failure during insert.  @clusterId = ', 
		@clusterId, 
		' not found'
	)
	; throw 50000, @msg, 1
end 
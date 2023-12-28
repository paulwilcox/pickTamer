create or alter procedure dbo.cluster_insert
	@clusterName nvarchar(100)
as 

if exists (
	select 1
	from dbo.cluster
	where clusterName = @clusterName
) begin
	declare @msg nvarchar(max) = concat(
		'Cannot insert.  ClusterName = ''', 
		@clusterName, 
		''' already exists' 
	)
	;throw 50000, '' , 1
end 

declare @inserteds table (clusterId int)

insert dbo.cluster (clusterName)
output inserted.clusterId into @inserteds
values (@clusterName)

select clusterId from @inserteds

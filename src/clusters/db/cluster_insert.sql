create or alter procedure dbo.cluster_insert
	@clusterName nvarchar(50)
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

insert dbo.cluster (clusterName)
values (@clusterName)

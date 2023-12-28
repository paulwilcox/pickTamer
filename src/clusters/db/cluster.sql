create table dbo.cluster (
	clusterId int identity(1,1),
		constraint pk_cluster primary key (clusterId),
	clusterName nvarchar(100) not null,
	isDefault bit not null, 
		constraint df_cluster_isDefault default 0 
)
go

insert dbo.cluster (clusterName, isDefault)
values ('default', 1)

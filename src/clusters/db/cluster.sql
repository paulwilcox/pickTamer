create table dbo.cluster (
	clusterId int identity(1,1),
		constraint pk_cluster primary key (clusterId),
	clusterName nvarchar(50),
	isDefault bit
)
go

insert dbo.cluster (clusterName, isDefault)
values ('default', 1)

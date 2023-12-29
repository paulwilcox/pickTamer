create table dbo.clusterPic (
	clusterPicId int identity(1,1)
		constraint pk_clusterPic primary key,
	clusterId int
		constraint fk_clusterPic_clusterId foreign key references dbo.cluster(clusterId),
	picId int
		constraint fk_clusterPic_picId foreign key references dbo.pic(picId),
	ord int not null
)
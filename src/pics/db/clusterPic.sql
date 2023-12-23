create table dbo.clusterPic (
	clusterPicId int identity(1,1),
		constraint pk_clusterPic primary key (clusterPicId),
	clusterId int,
		constraint fk_clusterPic_clusterId foreign key (clusterId) references dbo.cluster(clusterId),
	picId int,
		constraint fk_clusterPic_picId foreign key (picId) references dbo.pic(picId),
	previousPicId int,
		constraint fk_clusterPic_perviousPicId foreign key (previousPicId) references dbo.pic(picId),
	nextPicId int,
		constraint fk_clusterPic_nextPicId foreign key (nextPicId) references dbo.pic(picId)
)
-- note that an item can be unordered.  It would just have no previous/next
create table dbo.picOrderItem (
	picOrderItemId int identity(1,1),
		constraint pk_picOrderItem primary key (picOrderItemId),
	picOrderId int,
		constraint fk_picOrderItem_picOrderId foreign key (picOrderId) references dbo.picOrder(picOrderId),
	picId int,
		constraint fk_picOrderItem_picId foreign key (picId) references dbo.pic(picId),
	previousPicId int,
		constraint fk_picOrderItem_perviousPicId foreign key (previousPicId) references dbo.pic(picId),
	nextPicId int,
		constraint fk_picOrderItem_nextPicId foreign key (nextPicId) references dbo.pic(picId),
	isSelected bit
)
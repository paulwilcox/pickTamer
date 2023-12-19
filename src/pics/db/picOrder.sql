create table dbo.picOrder (
	picOrderId int identity(1,1),
		constraint pk_picOrder primary key (picOrderId),
	orderName nvarchar(50),
	isDefault bit,
	selectedItem int,
		constraint fk_picOrder_selectedItem 
			foreign key (selectedItem) references dbo.picOrderItem(picOrderItemId)
			on delete cascade
			on update cascade
)
go

insert dbo.picOrder (orderName, isDefault)
values ('default', 1)

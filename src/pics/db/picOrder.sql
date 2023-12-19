create table dbo.picOrder (
	picOrderId int identity(1,1),
		constraint pk_picOrder primary key (picOrderId),
	orderName nvarchar(50),
	isDefault bit
)
go

insert dbo.picOrder (orderName, isDefault)
values ('default', 1)

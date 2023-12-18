create table dbo.pics (
	picId int identity(1,1) not null,
		constraint [pk: pics(picId)] primary key clustered (picId),
	directory nvarchar(255) not null,
	name nvarchar(50) not null,
	extension nvarchar(15) not null,
	description nvarchar(255) null,
	notes nvarchar(1000) null
)

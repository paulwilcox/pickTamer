create table dbo.pic (
	picId int identity(1,1) not null,
		constraint pk_pic primary key clustered (picId),
	extension nvarchar(15) not null,
	description nvarchar(255) null,
	notes nvarchar(1000) null
)

create table dbo.pics (
	picsId int identity(1,1) not null,
		constraint [pk: pics(picsId)] primary key clustered (picsId),
	filePath nvarchar(255) not null,
	fileType nvarchar(15) not null
	name nvarchar(50) not null,
	description nvarchar(255) null,
	notes nvarchar(1000) null
)

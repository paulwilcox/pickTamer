create table dbo.picSources (
	picSourcesId int identity(1,1) not null,
		constraint [pk: picSources(picSourcesId)] 
			primary key clustered (picSourcesId),
	picsId int,
		constraint [fk: picSources (picsId) -> pics (picsId)] 
			foreign key (picsId) 
			references dbo.pics (picsId) 
			on delete cascade 
			on update cascade,
	source nvarchar(1000) not null -- usually a url
)
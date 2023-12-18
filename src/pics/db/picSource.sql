create table dbo.picSource (
	picSourceId int identity(1,1),
		constraint pk_picSource primary key (picSourceId),
	picId int,
		constraint fk_picSource_picId 
			foreign key (picId) references dbo.pic(picId)
			on update cascade
			on delete cascade,
	source nvarchar(4000), -- like a url or full file path
	sourceShort nvarchar(50) -- like a file name
)
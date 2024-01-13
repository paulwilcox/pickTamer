create table dbo.picHash (
  picId int 
    constraint pk_picHash primary key
    constraint fk_picHash_picId foreign key references dbo.pic(picId),
  SHA2_256 varbinary(64)
)
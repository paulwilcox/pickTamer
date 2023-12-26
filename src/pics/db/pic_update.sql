create or alter procedure dbo.pic_update
	@picId int,
	@label nvarchar(50),
	@description nvarchar(255),
	@notes nvarchar(1000)
as 
	
update dbo.pic set 
	label = @label,
	description = @description,
	notes = @notes
where picId = @picId
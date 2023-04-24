create table dbo.pics (
	picsId int identity(1,1) not null,
		constraint [pk: pics(picsId)] primary key clustered (picsId),
	filePath nvarchar(255) not null,
	fileType nvarchar(15) not null
	description nvarchar(255) null,
	notes nvarchar(1000) null,
	-- signature varbinary of some sort
)

/*
TODO:
	- tags (with primary)
	- source url (multiple?)
	- signature
	- series (inherently related pics)
	- gallery (user groupings)
	- ordering
		> multiple orderings allowed against a gallery?
		> for instance, one ordering for chronology (as user remembers it),
		> another ordering for rating/preference?
	- duplicate discovery/resolution
*/

/*

	cluster:
		- clusterId
		- name,
		- description
		- type: tag, gallery, series, duplicates

	picCluster
		- picClusterId
		- picId,
		- clusterId
		- fuzzyStrength (default 1)

	picClusterOrder
		- picClusterOrderId
		- picClusterId
		- orderingName
		- isPrimary
		- isRanking
		- isPrimaryRanking

*/
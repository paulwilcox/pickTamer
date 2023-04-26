
TODO:
	- tags (with primary)
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
create or alter procedure dbo.cluster_list
as

select clusterId, clusterName, isDefault
from dbo.cluster
order by isDefault desc, clusterName
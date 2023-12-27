let db = require('@db')

module.exports = {
    getClusters,
    updateCluster,
    insertCluster
}

async function getClusters () {
    return await db.query(`exec dbo.cluster_list`)
}

async function updateCluster(clusterId, clusterName) {
    return await db.execute(`
        exec dbo.cluster_update
            \@clusterId = @clusterId,
            \@clusterName = @clusterName
      `,
      { clusterId, clusterName }
    )
}

async function insertCluster(clusterName) {
    let result = 
      await db.query(`
        exec dbo.cluster_insert 
          \@clusterName = @clusterName
        `,
        { clusterName }
      )
    return result[0].clusterId // result should return exactly one record
}
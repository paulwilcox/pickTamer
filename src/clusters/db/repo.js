let db = require('@db')

module.exports = {
    getClusters,
}

async function getClusters () {
    return await db.query(`exec dbo.cluster_list`)
}



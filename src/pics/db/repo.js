let db = require('@db')

module.exports = {
    getClusterPics,
    getClusters,
    insertPic,
    upsertClusterPic,
    deleteClusterPic
}

async function getClusters () {
    return await db.query(`exec dbo.cluster_list`)
}

async function getClusterPics (clusterId = null) {
    return await db.query(`
        exec dbo.clusterPic_list
            \@clusterId = @clusterId
        `,
        { clusterId }
    )
}

async function insertPic (extension, source, sourceShort, description, notes) {
    if (!description) description = null
    if (!notes) notes = null
    let result = await db.query(`
        exec dbo.pic_insert
            \@extension = @extension,
            \@source = @source,
            \@sourceShort = @sourceShort,
            \@description = @description,
            \@notes = @notes
        `, { extension, source, sourceShort, description, notes }
    )
    return result[0].picId // result should return exactly one record
}

async function upsertClusterPic (clusterId, picId, picToMoveBeforeId) {
    await db.execute(`
        exec dbo.clusterPic_upsert
            \@clusterId = @clusterId,
            \@picId = @picId,
            \@picToMoveBeforeId = @picToMoveBeforeId
        `, { clusterId, picId, picToMoveBeforeId }
    )
}

async function deleteClusterPic (clusterId, picId) {
    await db.execute(`
        exec dbo.clusterPic_delete
            \@clusterId = @clusterId,
            \@picId = @picId
        `,
        { clusterId, picId })
}

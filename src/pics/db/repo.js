let db = require('@db')

module.exports = {
    getClusterPics,
    insertPic,
    upsertClusterPic,
    deleteClusterPic
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

    console.log('ess', {extension,source,sourceShort,nvc: db.NVarChar})

    if (!description) description = null
    if (!notes) notes = null

    let result = await db.query(`
        exec dbo.pic_insert
          \@extension = @extension,
          \@source = @source,
          \@sourceShort = @sourceShort,
          \@description = @description,
          \@notes = @notes
        `, 
        { extension, source, sourceShort, description, notes }
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

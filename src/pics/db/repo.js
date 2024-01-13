let db = require('@db')

module.exports = {
    getClusterPics,
    insertPic,
    updatePic,
    reorderClusterPics,
    generatePicHash
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
        `, 
        { extension, source, sourceShort, description, notes }
    )
    return result[0].picId // result should return exactly one record
}

async function updatePic (picId, label, description, notes) {
    await db.execute(`
        exec dbo.pic_update
            \@picId = @picId,
            \@label = @label,
            \@description = @description,
            \@notes = @notes
        `,
        { picId, label, description, notes }
    )
}

async function reorderClusterPics (clusterId, picIdCsv) {
    await db.execute(`
        exec dbo.clusterPic_reorder
            \@clusterId = @clusterId,
            \@picIdCsv = @picIdCsv
        `,
        { clusterId, picIdCsv}
    )
}

async function generatePicHash (algorithm, basePath, picId, extension) {
    await db.execute(`
        exec dbo.picHash_generate
            \@algorithm = @algorithm,
            \@basePath = @basePath,
            \@picId = @picId,
            \@extension = @extension
        `,
        { algorithm, basePath, picId, extension }
    )
}

let db = require('@db')

module.exports = {
    getPics,
    insertPic,
    selectPic
}

async function getPics (picOrderId = null) {
    return await db.query(`
        exec dbo.pic_list
            \@picOrderId = @picOrderId,
            \@isOrdered = null
        `,
        { picOrderId: null }
    )
}

async function selectPic (picId, picOrderId = null) {
    db.execute(`
        exec dbo.picOrderItem_select
            \@picId = @picId,
            \@picOrderId = @picOrderId
        `, { picId, picOrderId }
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
        `, {extension, source, sourceShort, description, notes}
    )
    return result[0].picId // result should return exactly one record
}



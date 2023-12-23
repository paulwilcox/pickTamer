let db = require('@db')

module.exports = {
    getPics,
    getPicOrders,
    insertPic,
    upsertPicOrderItem,
    deletePicOrderItem
}

async function getPicOrders () {
    return await db.query(`exec dbo.picOrder_list`)
}

async function getPics (picOrderId = null) {
    return await db.query(`
        exec dbo.picOrderItem_list
            \@picOrderId = @picOrderId
        `,
        { picOrderId: picOrderId === null ? null : parseInt(picOrderId) }
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

async function upsertPicOrderItem (picOrderId, picId, picToMoveAfterId) {
    await db.execute(`
        exec dbo.picOrderItem_upsert
            \@picOrderId = @picOrderId,
            \@picId = @picId,
            \@picToMoveAfterId = @picToMoveAfterId
        `, { picOrderId, picId, picToMoveAfterId }
    )
}

async function deletePicOrderItem (picOrderId, picId) {
    await db.execute(`
        exec dbo.picOrderItem_delete
            \@picOrderId = @picOrderId,
            \@picId = @picId
        `,
        { picOrderId, picId })
}

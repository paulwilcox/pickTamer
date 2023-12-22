let db = require('@db')

module.exports = {
    getPics,
    getPicOrders,
    insertPic,
    movePic
}

async function getPicOrders () {
    return await db.query(`exec dbo.picOrder_list`)
}

async function getPics (picOrderId = null) {
    return await db.query(`
        exec dbo.pic_list
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
        `, {extension, source, sourceShort, description, notes}
    )
    return result[0].picId // result should return exactly one record
}

async function movePic (picOrderId, picToMoveId, moveAfterPicId) {
    await db.execute(`
        exec dbo.picOrderItem_move
            \@picOrderId = @picOrderId,
            \@picToMoveId = @picToMoveId,
            \@moveAfterPicId = @moveAfterPicId
        `, {picOrderId, picToMoveId, moveAfterPicId}
    )
}

let db = require('@db')

module.exports = {
    getPics,
    getPicOrders,
    insertPic
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



let db = require('@db')

module.exports = {
    getPics,
    insertPic
}

async function getPics (picId = null) {

    let cmd = `
        select  *
        from    dbo.pics
        where   picId = @picId or @picId is null
    `
    let params = { picId: picId }
    return await db.query(cmd, params);

}

async function insertPic (directory, origName, extension, description, notes) {
    if (!description) description = null
    if (!notes) notes = null
    let result = await db.query(`
        exec dbo.pic_insert
            \@directory = @directory,
            \@origName = @origName,
            \@extension = @extension,
            \@description = @description,
            \@notes = @notes
    `, {directory, origName, extension, description, notes}
    )
    return result[0].picId // result should return exactly one record
}



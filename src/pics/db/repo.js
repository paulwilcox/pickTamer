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

async function insertPic (directory, name, extension, description, notes) {
    let result = await db.query(`
        exec dbo.pics_insert
            \@directory = @directory,
            \@name = @name,
            \@extension = @extension,
            \@description = @description,
            \@notes = @notes
    `, {directory, name, extension, description, notes}
    )
    let picId = result[0].picId // result should return exactly one record
    console.log(
        `'${name}.${extension} inserted with picId = ${picId}`
    )
    return picId
}



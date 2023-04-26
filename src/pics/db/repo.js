let db = require('@db')

module.exports = {
    getPics
}

async function getPics (picsId = null) {

    let cmd = `
        select  *
        from    dbo.pics
        where   picsId = @picsId or @picsId is null
    `
    let params = { picsId: picsId }
    return await db.query(cmd, params);

}

async function upsertPic (filePath, fileType, name, description, notes, source) {
    return await db.query(`dbo.pics_upsert`, {
        filePath, fileType, name, description, notes, source
    });
}



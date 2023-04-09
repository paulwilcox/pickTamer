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
    let params = { picsId: null }
    return await db.query(cmd, { picsId: picsId });

}




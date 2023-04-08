let mssql = require('mssql/msnodesqlv8');
let config = require('../../config.json');

module.exports = {
    picsGet
}

async function picsGet(picsId = null) {
  try {
    let sql = await mssql.connect(config.picTamerSql);
    let result = await sql.query `
        select  n = count(*) 
        from    dbo.pics
        where   picsId = ${picsId} or ${picsId} is null
    `;
    return result.recordset;
  } 
  catch (err) {
    console.error(err);
  }
  finally {
    mssql.close();
  }
}


picsGet().then(data => console.log(data));
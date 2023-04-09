let mssql = require('mssql/msnodesqlv8');
let config = require('@configJson');
module.exports = { query, execute }
/*
  Example:    let cmd = `
                select  n = count(*) 
                from    dbo.pics
                where   picsId = @picsId or @picsId is null
              `
              let params = { picsId: null }
              query(cmd, params).then(data => console.log(data));
*/

let pool = new mssql.ConnectionPool(config.picTamerSql);

async function execute(cmd, params = null) {
  try {
    let con = await pool.connect();
    let request = con.request();
    for (let key in params) 
      request.input(key, params[key]);
    return request.query(cmd);
  } 
  catch (err) {
    console.error(err);
  }
}

async function query(cmd, params = null) {
  let response = await execute(cmd, params);
  return response.recordset;
}


let mssql = require('mssql');
let config = require('./config.json');

// following https://stackoverflow.com/questions/5156806/node-js-and-microsoft-sql-server


mssql.connect(config.picTamerSql, func);

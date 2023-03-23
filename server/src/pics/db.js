let tedious = require('tedious');
let config = require('./config.json');

let con = new tedious.Connection({
    server: config.sqlServer,
    authentication: {
        type: 'default',
        options: {
            userName: config.sqlUserName,
            password: config.sqlPassword
        }
    },
    options: { 
        database: config.sqlDatabase
    }
});

// sort following https://learn.microsoft.com/en-us/sql/connect/node-js/step-3-proof-of-concept-connecting-to-sql-using-node-js?view=sql-server-ver16


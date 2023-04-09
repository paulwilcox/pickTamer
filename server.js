let express = require('express');
require('module-alias/register');
let homeController = require('./src/home/controller.js');

// let x = require('./src/pics/server/db.js');
// x.getPics().then(pics => console.log(pics));

let app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use('/home', homeController);
app.use('/', homeController);

app.listen(3000, () => console.log('server started: http://localhost:3000'));

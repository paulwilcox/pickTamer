let express = require('express');
require('module-alias/register');
let homeRouter = require('./src/home/expRouter.js');
let picsRouter = require('./src/pics/expRouter.js');

let app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use('/home', homeRouter);
app.use('/', homeRouter);
app.use('/pics', picsRouter);

app.listen(3000, () => console.log('server started: http://localhost:3000'));


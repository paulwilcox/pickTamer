let express = require('express')
require('module-alias/register')
let homeRouter = require('./src/home/expRouter.js')
let picsRouter = require('./src/pics/expRouter.js')
let picsController = require('./src/pics/controller.js')
let imagesDirectory = 'p:\\picsToTame'

picsController.loadNewImages(imagesDirectory)

let app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/pics', picsRouter);

app.get('/image', (req, res) => {
    console.log('server.js /fileName')
    let imagePath = imagesDirectory + '//' + req.query.fileName
    res.sendFile(imagePath)
});

app.listen(3000, () => console.log('server started: http://localhost:3000'));


let express = require('express');
let picsDb = require('./src/pics/db.js');

let app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get('/', (req,res) => res.send('server api home'));
app.get('/fetchApiExample', (req,res) => res.send(`{"message": "this is an example", "question": "is it working?"}`));
app.get('/pics', async (req,res) => {
    let data = await picsDb.picsGet();
    let json = JSON.stringify(data);
    res.send(json);
})

app.listen(3000, () => console.log('server started: http://localhost:3000'));




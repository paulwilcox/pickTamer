let express = require('express');

let app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get('/', (req,res) => res.send('server api home'));
app.get('/fetchApiExample', (req,res) => res.send(`{"message": "this is an example", "question": "is it working?"}`));

app.listen(3000, () => console.log('server started: http://localhost:3000'));




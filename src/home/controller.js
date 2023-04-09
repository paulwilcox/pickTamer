let express = require('express');
let router = express.Router();

router.get('/', (req,res) => res.send('server api home'));
router.get('/in', (req,res) => res.send('in home'));
router.get('/away', (req,res) => res.send('away from home'));

module.exports = router;

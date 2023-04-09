let express = require('express');
let router = express.Router();
let db = require('./db');

router.get('/pics', async (req, res) => {
  let pics = await db.getPics();
  res.render('pics', pics );
});

module.exports = router;
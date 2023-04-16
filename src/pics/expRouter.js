let express = require('express');
let router = express.Router();
let db = require('./db/repo.js');

router.get('/', async (req, res) => {
  let pics = await db.getPics();
  let json = JSON.stringify(pics);
  res.json(json);
});

module.exports = router;
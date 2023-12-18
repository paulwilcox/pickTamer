let express = require('express');
let router = express.Router();
let db = require('./db/repo.js');


router.get('/', async (req, res) => {
  let picsId = res.query ? res.query.picsId || null : null;
  let pics = await db.getPics(picsId);
  let json = JSON.stringify(pics);
  res.json(json);
});

module.exports = router;
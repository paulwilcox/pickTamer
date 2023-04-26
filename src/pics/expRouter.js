let express = require('express');
let router = express.Router();
let db = require('./db/repo.js');

router.get('/', async (req, res) => {
  let picsId = res.query.picsId;
  let pics = await db.getPics(picsId);
  let json = JSON.stringify(pics);
  res.json(json);
});

router.get('/upsert', async (req, res) => {
  let { name, description, notes, source } = req.query;
  
  // todo: use the source to actually download the image.  
  let filePath = '';
  let fileType = '';
  // download here, or do that earlier and pass it in.


  await db.upsertPics(filePath, fileType, name, description, notes, source);
});

module.exports = router;
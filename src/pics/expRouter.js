let express = require('express')
let router = express.Router()
let db = require('./db/repo.js')

router.get('/', async (req, res) => {
  let picId = req.query.picId || null
  let pics = await db.getPics(picId)
  let json = JSON.stringify(pics)
  res.json(json)
});

router.get('/select', async (req, res) => {
  let picId = req.query.picId || null
  let picOrderId = req.query.picOrderId || null
  await db.selectPic(picId, picOrderId)
  res.end()
});

module.exports = router
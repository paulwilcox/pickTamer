let express = require('express')
let router = express.Router()
let db = require('./db/repo.js')

router.get('/', async (req, res) => {
  let picOrderId = req.query.picOrderId || null
  let pics = await db.getPics(picOrderId)
  let json = JSON.stringify(pics)
  res.json(json)
});

router.get('/picOrders', async (req, res) => {
  let picOrders = await db.getPicOrders()
  let json = JSON.stringify(picOrders)
  res.json(json)
});

router.get('/movePic', async (req, res) => {
  let picOrderId = req.query.picOrderId
  let picToMoveId = req.query.picToMoveId
  let moveAfterPicId = req.query.moveAfterPicId
  if (moveAfterPicId === 'null')
    moveAfterPicId = null
  await db.movePic(picOrderId, picToMoveId, moveAfterPicId)
  res.end()
})

module.exports = router
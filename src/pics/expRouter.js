let express = require('express')
let router = express.Router()
let db = require('./db/repo.js')

router.get('/', async (req, res) => {
  let picOrderId = req.query.picOrderId || null
  let pics = await db.getPics(picOrderId)
  let json = JSON.stringify(pics)
  res.json(json)
})

router.get('/picOrders', async (req, res) => {
  let picOrders = await db.getPicOrders()
  let json = JSON.stringify(picOrders)
  res.json(json)
})

router.get('/upsertPicOrderItem', async (req, res) => {
  let picOrderId = req.query.picOrderId
  let picId = req.query.picId
  let picToMoveAfterId = req.query.picToMoveAfterId
  if (picToMoveAfterId === 'null')
    picToMoveAfterId = null
  await db.upsertPicOrderItem(picOrderId, picId, picToMoveAfterId)
  res.end()
})

router.get('/deletePicOrderItem', async (req, res) => {
  let picOrderId= req.query.picOrderId
  let picId = req.query.picId
  await db.deletePicOrderItem(picOrderId, picId)
  res.end()
})

module.exports = router
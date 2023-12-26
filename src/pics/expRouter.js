let express = require('express')
let router = express.Router()
let db = require('./db/repo.js')
db.cluster = require('../clusters/db/repo.js')
let config = require('@configJson')

router.get('/', async (req, res) => {
  let clusterId = req.query.clusterId || null
  let pics = await db.getClusterPics(clusterId)
  let json = JSON.stringify(pics)
  res.json(json)
})

router.get('/getFile', (req, res) => {
  let imagePath = config.picTamerFileRoot + '//' + req.query.fileName
  res.sendFile(imagePath)
})

router.get('/updatePic', async (req,res) => {
  let picId = req.query.picId
  let label = req.query.label
  let description = req.query.description
  let notes = req.query.notes
  await db.updatePic(picId, label, description, notes)
  res.end()
})

router.get('/reorderClusterPics', async (req,res) => {
  let clusterId = req.query.clusterId
  let picIdCsv = req.query.picIdCsv
  await db.reorderClusterPics(clusterId, picIdCsv)
  res.end()
})

module.exports = router
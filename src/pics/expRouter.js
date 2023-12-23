let express = require('express')
let router = express.Router()
let db = require('./db/repo.js')

router.get('/', async (req, res) => {
  let clusterId = req.query.clusterId || null
  let pics = await db.getClusterPics(clusterId)
  let json = JSON.stringify(pics)
  res.json(json)
})

router.get('/clusters', async (req, res) => {
  let clusters = await db.getClusters()
  let json = JSON.stringify(clusters)
  res.json(json)
})

router.get('/upsertClusterPic', async (req, res) => {
  let clusterId = req.query.clusterId
  let picId = req.query.picId
  let picToMoveBeforeId = req.query.picToMoveBeforeId
  if (picToMoveBeforeId === 'null')
    picToMoveBeforeId = null
  await db.upsertClusterPic(clusterId, picId, picToMoveBeforeId)
  res.end()
})

router.get('/deleteClusterPic', async (req, res) => {
  let clusterId= req.query.clusterId
  let picId = req.query.picId
  await db.deleteClusterPic(clusterId, picId)
  res.end()
})

module.exports = router
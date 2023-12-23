let express = require('express')
let router = express.Router()
let db = require('./db/repo.js')

router.get('/', async (req, res) => {
  let clusters = await db.getClusters()
  let json = JSON.stringify(clusters)
  res.json(json)
})

router.get('/updateCluster', async (req, res) => {
  let clusterId = req.query.clusterId
  let clusterName = req.query.clusterName
  await db.updateCluster(clusterId, clusterName)
  res.end()
})

router.get('/insertCluster', async (req, res) => {
  let clusterName = req.query.clusterName
  await db.insertCluster(clusterName)
  res.end()
})

module.exports = router

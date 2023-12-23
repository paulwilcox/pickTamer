let express = require('express')
let router = express.Router()
let db = require('./db/repo.js')

router.get('/', async (req, res) => {
  let clusters = await db.getClusters()
  let json = JSON.stringify(clusters)
  res.json(json)
})

module.exports = router

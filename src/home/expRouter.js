let express = require('express')
let router = express.Router()
let picsDb = require('../pics/db/repo.js')
let fs = require('fs').promises
let path = require('path')
let config = require('@configJson')
let allowedExtensions = ['jpg','jpeg','png','gif']

router.get('/', (req,res) => res.send('server api home'));

router.get('/loadNewPics', async (req,res) => { 

  let imagesDirectory = config.picTamerFileRoot
  let newFilesPath = `${imagesDirectory}\\new`
  let responseMessage = null

  let files = await fs.readdir(newFilesPath)
  files = files.filter(file => {
    let extension = path.extname(file).slice(1)
    return allowedExtensions.includes(extension)
  })

  if (files.length === 0) {
    responseMessage = `No pics to insert`
    res.json(`"${responseMessage}"`)
    return
  }

  for(let file of files) {

    let extension = path.extname(file).slice(1)
    let insertedPicId = await picsDb.insertPic(
        extension, 
        `${newFilesPath}\\${file}`, // source 
        file // sourceShort
    )

    let newFile = `${insertedPicId}.${extension}`
    let oldFull = `${newFilesPath}\\${file}`
    let newFull = `${imagesDirectory}\\${newFile}`
    await fs.rename(oldFull, newFull)

  }

  responseMessage = `${files.length} files loaded`
  console.log('rm', responseMessage)
  res.json(`"${responseMessage}"`)

})

router.get('/rejectBadPics', async (req,res) => { 

  let imagesDirectory = config.picTamerFileRoot
  let newFilesPath = `${imagesDirectory}\\new`
  let rejectedPath = `${imagesDirectory}\\rejected`
  let responseMessage = null

  let files = await fs.readdir(newFilesPath)
  files = files.filter(file => {
    let extension = path.extname(file).slice(1)
    return !allowedExtensions.includes(extension)
  })

  if (files.length === 0) {
    responseMessage = `No pics to reject`
    res.json(`"${responseMessage}"`)
    return
  }

  for(let file of files) {
    let oldFull = `${newFilesPath}\\${file}`
    let newFull = `${rejectedPath}\\${file}`
    await fs.rename(oldFull, newFull)
  }

  responseMessage = `${files.length} files rejected`
  console.log('rm', responseMessage)
  res.json(`"${responseMessage}"`)
  
})

module.exports = router;

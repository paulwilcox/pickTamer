/*
  Jut temporary.  Not ideal.  Couldn't be extended to 
  multi-user or web environment.  Either manual upload
  or web extension is better.  But for now, this is 
  just to ease the process while I work on other things.  
*/

let chokidar = require('chokidar')
let { exec } = require('child_process')
let config = require('./config.json')
let path = require('path')
let fs = require('fs').promises

let imagesDirectory = config.picTamerFileRoot
let directoryToWatch = `${imagesDirectory}\\new`
let ignoredExtensions = ['crdownload'] // ignored don't get rejected either

let watcher = chokidar.watch(
  directoryToWatch, 
  {
    ignored: /[\/\\]\./, // ignore hidden files
    ignoreInitial: true, // ignore existing files
    followSymlinks: false,
    persistent: true
  }
)

watcher.on(
  'add', 
  async (filePath) => {
    console.log(`watcher saw ${filePath} and is processing`)
    let extension = path.extname(filePath).slice(1)
    if (ignoredExtensions.includes(extension))    
      return
    let success = await loadNewPics()
    if (success) 
      openWebsite()
    else 
      messageBox('failed to process image')
    console.log('watcher file processing complete')
  }
)

console.log(`Watching directory: ${directoryToWatch}`);

async function openWebsite() {

    let clusterList = await getClusters()
    let defaultClusterId = 
      clusterList
      .find(cluster => cluster.isDefault = 1)
      ?.clusterId
    if (!defaultClusterId) 
      throw 'Wont open website. defaultClusterId not found'
  
    let url = `http://localhost:5173/pics?preLoadWithClusterId=${defaultClusterId}`
    let cmd = 
      config.fileWatcherWebOverwrite
      ? config.fileWatcherWebOverwrite.replace('{{defaultClusterId}}', defaultClusterId)
      : `start ${url}`
      
    exec(cmd, (error, stdout, stderr) => {
      if (error) 
          throw `Error opening website: ${error}`
    });
}

async function getClusters() {
  let response = await fetch('http://localhost:3000/clusters');
  if (!response.ok)
    throw `error fetching clusters`;
  let json = await response.json();
  return JSON.parse(json);
}

async function loadNewPics() {
  let response
  try {

    response = await fetch(`http://localhost:3000/rejectBadPics`)
    if (!response.ok) 
      throw 'failed to fetch while rejecting bad pics'

    let json = await response.json()
    let parsed = JSON.parse(json)      
    if (parsed?.includes('rejected'))
      throw parsed
    
    response = await fetch(`http://localhost:3000/loadNewPics`)
    if (!response.ok) 
      throw 'failed to fetch while loading new pics'

  }
  catch (ex) {
    console.log(ex.message)
    return false
  }

  let files = await fs.readdir(directoryToWatch)
  let success = files.length === 0 
  return success

}

function messageBox(message) {
    let powershellCommand = `Add-Type -AssemblyName PresentationFramework;[System.Windows.MessageBox]::Show('${message}')`

    exec(`powershell -Command "${powershellCommand}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error displaying message box: ${error}`);
        } else {
            console.log(`Displayed message box successfully`);
        }
    });
}


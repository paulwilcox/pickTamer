let db = require('./db/repo.js');
let fs = require('fs');
let path = require('path');

module.exports.loadNewImages = async function (imagesDirectory) {
    let newFilesPath = `${imagesDirectory}\\new`
    await fs.readdir(newFilesPath, async (err, files) => {

        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        if (files.length === 0) 
            console.log(`No pics in ${newFilesPath} to insert`)

        for(let file of files) {

            let origName = path.parse(file).name 
            let extension = path.extname(file).slice(1)
            let insertedPicId = await db.insertPic(imagesDirectory, origName, extension)

            let origNameExt = `${origName}.${extension}`
            let oldFull = `${newFilesPath}\\${origNameExt}`
            let newFull = `${imagesDirectory}\\${insertedPicId}.${extension}`
            await fs.rename(oldFull, newFull, err => 
                err 
                ? console.err(`Could not process ${origNameExt}}`)
                : console.log(
                    `'${origNameExt} processed as ${insertedPicId}.${extension}`
                  )
            )

        }

    })

}


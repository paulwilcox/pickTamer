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

            let extension = path.extname(file).slice(1)
            let insertedPicId = await db.insertPic(
                extension, 
                `${newFilesPath}\\${file}`, // source 
                file // sourceShort
            )

            let newFile = `${insertedPicId}.${extension}`
            let oldFull = `${newFilesPath}\\${file}`
            let newFull = `${imagesDirectory}\\${newFile}`
            await fs.rename(oldFull, newFull, err => 
                err 
                ? console.err(`Could not process ${file}}`)
                : console.log(`'${file} processed as ${newFile}`)
            )

        }

    })

}


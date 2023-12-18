let db = require('./db/repo.js');
let fs = require('fs');
let path = require('path');

module.exports.loadNewImages = function (imagesDirectory) {

    fs.readdir(`${imagesDirectory}\\new`, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        if (files.length === 0) 
            console.log(`No pics in ${imagesDirectory} to insert`)
        for(let file of files) {
            path.extname
            db.insertPic(
                imagesDirectory, // directory
                path.parse(file).name, // name
                path.extname(file).slice(1), // extension
                null, // description
                null // notes
            )
        }
    })

}


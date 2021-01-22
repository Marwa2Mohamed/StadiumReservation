//Mime Type accepted
var images = [
    'image/png', 'image/jpeg', 'image/gif', 'image/x-jg', 'image/bmp', 'image/x-windows-bmp', 'image/vnd.dwg',
    'image/x-dwg', 'image/vnd.dwg', 'image/x-dwg', 'image/fif', 'image/florian',
    'image/vnd.fpx', 'image/vnd.net-fpx', 'image/g3fax', 'image/x-icon', 'image/ief',
    'image/ief', 'image/pjpeg', 'image/x-jps'

];

// images parsing
const multer = require('multer'),
    fileSystem = require('fs');


//Store in the desk
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
            let dir = './products_images';
            if (!fileSystem.existsSync(dir)) {//if folder doesn't exits create it
                fileSystem.mkdirSync(dir);
            }
            cb(null, dir); // null: for error checking type 
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() +'_'+ file.originalname);
        }
    }), 

fileFilter = (req, file, cb) => {
        var extension_found = false;
        for (let index = 0; index < images.length; index++) {
            if (file.mimetype === images[index]) {
                extension_found = true;
                cb(null, true); // save this file
                break;
            }
        }

        if (!extension_found)
            cb(new Error('only images extensions is accepted'), false); // don't save this file
            console.log(file.originalname);
    },

    upload = multer({
        storage: storage,
        fileFilter: fileFilter
    })// the image(S) folder

module.exports = upload;
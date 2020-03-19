const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

// Configure multer: where to store files, and how to store them (proper name, etc)
const storage = multer.diskStorage({
    // function called when multer tries to save a file
    // The path to the file is relative to the server.js file
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type: " + file.mimetype);
        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

// Use multer as middlewear to store the file coming over the wire.
// Use the multer(storage).single('image') function call. The 'image'
// parameter is the object that contains the image.
module.exports = multer({storage: storage}).single('image');


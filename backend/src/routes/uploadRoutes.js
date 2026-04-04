const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists based on role checks in controllers

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', protect, upload.single('image'), (req, res) => {
    console.log('📸 Upload Request Received');
    if (!req.file) {
        console.error('❌ No file in request');
        res.status(400);
        throw new Error('No file uploaded');
    }
    
    const relativeUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    console.log(`✅ Image uploaded successfully: ${relativeUrl}`);
    
    res.send({
        url: relativeUrl,
        message: 'Image uploaded successfully'
    });
});

module.exports = router;

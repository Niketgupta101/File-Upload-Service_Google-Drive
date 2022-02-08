const express = require('express');
const multer = require('multer');
const { uploadFile, deleteFile, generateDownloadUrl, generatePreviewUrl } = require('../service/crud-file-service');

const router = express.Router();

const storage = multer.diskStorage({});

const upload = multer({ storage });

router.post('/file', upload.single('file'), uploadFile);

router.delete('/file/:id', deleteFile);

router.get('/file/download/:id', generateDownloadUrl);

router.get('/file/preview/:id', generatePreviewUrl)

module.exports = router;
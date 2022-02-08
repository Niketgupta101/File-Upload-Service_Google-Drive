const { google } = require('googleapis');
// const path = require('path');
const fs = require('fs');

require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;

const refreshToken = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2( clientId, clientSecret, redirectURI );

oAuth2Client.setCredentials({ refresh_token: refreshToken });

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
})

// const filePath = path.join(__dirname, 'bg.jpg');

exports.uploadFile = async (req, res, next) => {
    const filePath = req.file.path;

    try {
        const response = await drive.files.create({
            requestBody: {
                name: `file-${Date.now()}`,
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath),
            }
        });

        res.status(201).json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: true, message: 'Something went wrong' });
    }
}

exports.deleteFile = async (req, res, next) => {
    const { id } = req.params;

    try {
        await drive.files.delete({
            fileId: id
        });

        res.status(201).json({ success: true, message: 'File deleted successfully'});
    } catch (error) {
        res.status(500).json({ success: true, message: 'Something went wrong' });
    }
}

exports.generatePreviewUrl = async (req, res, next) => {
    try {
        const fileId = req.params.id;

        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        const result = await drive.files.get({
            fileId,
            fields: 'webViewLink'
        });

        res.status(201).json({ previewLink: result.data.webViewLink });
    } catch (error) {
        res.status(500).json({ success: true, message: 'Something went wrong' });
    }
}

exports.generateDownloadUrl = async (req, res, next) => {
    try {
        const fileId = req.params.id;

        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        const result = await drive.files.get({
            fileId,
            fields: 'webContentLink'
        });

    res.status(201).json({ downloadLink: result.data.webContentLink });
    } catch (error) {
        res.status(500).json({ success: true, message: 'Something went wrong' });
    }
}
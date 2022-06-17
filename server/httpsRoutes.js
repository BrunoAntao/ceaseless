const express = require("express");
const app = express();
const https = require('https');
const fs = require('fs');
const path = require('path');

module.exports = (port) => {

    const options = {

        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),

    };

    app.use('/', express.static(path.join(__dirname, "../client")));

    return https.createServer(options, app).listen(port, () => {

        console.log(`HTTPS server running on port ${port}`);

    });

}
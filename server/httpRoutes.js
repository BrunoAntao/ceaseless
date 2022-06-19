const express = require("express");
const app = express();
const http = require('http');
const path = require('path');

module.exports = (port) => {

    app.use('/', express.static(path.join(__dirname, "../client")));

    app.use('/demo', express.static(path.join(__dirname, "../docs")));

    http.createServer(app).listen(port, () => {

        console.log(`HTTP server running on port ${port}`);

    });

}
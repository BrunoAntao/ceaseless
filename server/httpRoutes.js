const express = require("express");
const app = express();
const http = require('http');
const path = require('path');

module.exports = (port) => {

    app.use('/', express.static(path.join(__dirname, "../")));

    http.createServer(app).listen(port, () => {

        console.log(`HTTP server running on port ${port}`);

    });

}
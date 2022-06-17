const path = require('path');

module.exports = {
    entry: './client/js/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
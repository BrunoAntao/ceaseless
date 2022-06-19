const path = require('path');

module.exports = {
    entry: './client/js/main.js',
    mode: "production",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'docs'),
    },
}; 
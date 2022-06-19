const fse = require('fs-extra');

const srcDir = `./client`;
const destDir = `./docs`;

fse.copySync(srcDir, destDir, { overwrite: true });

console.log('done');
const fs = require('fs');

let width = 20;
let height = 18;
let rawMap = { width, height, tiles: new Array(width) };

let generateFrame = () => {

    // return Math.floor(Math.random() * tilesetSprite.frames);

    return 0;

}

for (let x = 0; x < width; x++) {

    rawMap.tiles[x] = new Array(height);

    for (let y = 0; y < height; y++) {

        // if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {

        rawMap.tiles[x][y] = { key: 'tileset01', frame: generateFrame() };

        // }

    }

}

let x = Math.floor(Math.random() * (width - 1));
let y = Math.floor(Math.random() * (height - 1));
rawMap.tiles[x][y] = { key: 'tileset01', frame: 0, data: 'spawn' };

fs.writeFileSync('./map.json', JSON.stringify(rawMap));
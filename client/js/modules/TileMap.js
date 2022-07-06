import { Sprite } from './AssetLoader.js';
import { Physics } from './Physics.js';
import { Vec2 } from './Vec2.js';

export class TileMap {

    constructor(rawData) {

        this.tiles = [];
        this.rawData = rawData;
        this.group = new Physics.Group();
        this.spawn = new Vec2();

    }

    loadToScene(scene) {

        for (let x = 0; x < this.rawData.width; x++) {

            for (let y = 0; y < this.rawData.height; y++) {

                const tileData = this.rawData.tiles[x][y];

                if (tileData && tileData.key) {

                    const asset = scene.Modules.AssetLoader.getAsset(tileData.key);

                    // let tile = new Entity(scene,
                    //     tileData.key,
                    //     new Vec2(x * asset.frameWidth, y * asset.frameHeight),
                    //     {
                    //         Physics:
                    //         {
                    //             immovable: true
                    //         }
                    //     });

                    let tile = new Sprite(scene, tileData.key, new Vec2(x * asset.frameWidth, y * asset.frameHeight));
                    tile.frame = tileData.frame;

                    let body = new Physics.Body();
                    body.attach(tile);
                    this.group.add(body);
                    this.tiles.push(tile);

                }

                if (tileData && tileData.data) {

                    if (tileData.data === 'spawn') {

                        this.spawn = new Vec2(x * 32, y * 32);

                    }

                }

            }

        }

    }

}
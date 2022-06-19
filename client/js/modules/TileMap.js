import { Entity, Physics } from './Physics.js';
import { Vec2 } from './Vec2.js';

export class TileMap {

    constructor() {

        this.tiles = [];
        this.group = new Physics.Group();
        this.spawn = new Vec2();

    }

    loadToScene(scene) {

        this.spawn.x = Math.floor(Math.random() * scene.canvas.width / 16) * 16;
        this.spawn.y = Math.floor(Math.random() * scene.canvas.height / 16) * 16;

        for (let x = 0; x < scene.canvas.width / 16; x++) {

            for (let y = 0; y < scene.canvas.height / 16; y++) {

                if (x != this.spawn.x && y != this.spawn.y) {

                    if (Math.random() > 0.99) {

                        let tile = new Entity(scene,
                            'player',
                            new Vec2(x * 16, y * 16));
                        this.group.add(tile.getBody());
                        this.tiles.push(tile);

                    }

                }

            }

        }

    }

}
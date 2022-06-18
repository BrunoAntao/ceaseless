import { Entity, Physics } from '/js/modules/Physics.js';
import { Vec2 } from '/js/modules/Vec2.js';

export class TileMap {

    constructor() {

        this.tiles = [];
        this.group = new Physics.Group();

    }

    loadToScene(scene) {

        for (let x = 0; x < 10; x++) {

            for (let y = 0; y < 10; y++) {

                let tile = new Entity(scene,
                    'player',
                    new Vec2(100 + x * 16, 100 + y * 16));
                this.group.add(tile.getBody());
                this.tiles.push(tile);

            }

        }

    }

}
import { Scene, Graphics } from './modules/Scene.js';
import { AssetLoader, Sprite } from './modules/AssetLoader.js';
import { InputHandler } from './modules/InputHandler.js';
import { PhysicsModule, Physics, Entity } from './modules/Physics.js';
import { Player } from './modules/Game.js';
import { Vec2 } from './modules/Vec2.js';
import { TileMap } from './modules/Tilemap.js';

let gameScene = async () => {

    let scene = new Scene({

        backgroundColor: "rgba(33, 33, 33, 1)"

    });

    const Loader = scene.useModule(new AssetLoader());
    scene.useModule(new InputHandler());
    const PhysicsManager = scene.useModule(new PhysicsModule({
        // drawBodies: true
    }));

    Loader.loadSprite('tile', 'assets/tile.png', 32, 32);
    Loader.loadSprite('player', 'assets/player.png', 16, 16);

    await Loader.loaded();

    let width = 20;
    let height = 18;
    let rawMap = { width, height, tiles: new Array(width) };

    for (let x = 0; x < width; x++) {

        rawMap.tiles[x] = new Array(height);

        for (let y = 0; y < height; y++) {

            if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {

                rawMap.tiles[x][y] = { key: 'tile' };

            }

        }

    }

    let x = 1 + Math.floor(Math.random() * (width - 2));
    let y = 1 + Math.floor(Math.random() * (height - 2));
    rawMap.tiles[x][y] = { data: 'spawn' };

    let tilemap = new TileMap(rawMap);

    tilemap.loadToScene(scene);

    console.log(tilemap.spawn);
    let player = new Player(scene, new Vec2(32 + 16, 32 + 16));

    PhysicsManager.collidesWith([player, tilemap.group]);

    PhysicsManager.Detector([player.bulletsPhysicsGroup, tilemap.group], (collision, bullet, tile) => {

        bullet.owner.remove();

    })

    let enemyGroup = new Physics.Group();

    let spawnEnemy = (radius = 100) => {

        if (enemyGroup.bodies.length < 5) {

            let r = radius * Math.sqrt(Math.random());
            let theta = Math.random() * 2 * Math.PI;

            let x = player.position.x + r * Math.cos(theta);
            let y = player.position.y + r * Math.sin(theta);

            if (x > 0 && x < width * 32 && y > 0 && y < height * 32) {

                let enemy = new Entity(scene, 'player', new Vec2(x, y));

                enemyGroup.add(enemy.getBody());

            } else {

                spawnEnemy();

            }

        }

    }

    PhysicsManager.Detector([player.bulletsPhysicsGroup, enemyGroup], (collision, bullet, enemy) => {

        bullet.owner.remove();
        enemy.owner.remove();

        spawnEnemy();

    })

    PhysicsManager.Detector([enemyGroup, tilemap.group], (collision, enemy, tile) => {

        enemy.owner.remove();

        spawnEnemy();

    })

    let interval = 1000;
    let lastUpdate = 0;

    scene.update = () => {

        if (Date.now() - lastUpdate > interval) {

            spawnEnemy();

            lastUpdate = Date.now();

        }

    }

}

let editorScene = async () => {

    let scene = new Scene({

        backgroundColor: "rgba(33, 33, 33, 1)"

    });

    scene.useModule(new InputHandler());

}

document.addEventListener('DOMContentLoaded', async () => {

    gameScene();

    // editorScene();

});
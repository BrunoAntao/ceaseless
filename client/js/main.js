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
    const PhysicsManager = scene.useModule(new PhysicsModule({}));

    Loader.loadSprite('tile', 'assets/tile.png', 32, 32);
    Loader.loadSprite('player', 'assets/player.png', 16, 16);

    await Loader.loaded();

    // let enemy = new Entity(scene, 'player', new Vec2(128, 64));

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
    let player = new Player(scene, tilemap.spawn);

    PhysicsManager.Detector([tilemap.group, player], (collision, a, b) => {

        let intersect = new Physics.Body(collision[0]).getOffset();

        let p;
        let w;

        if (player.body.uuid === a.uuid) {

            p = a;
            w = b;

        }

        if (player.body.uuid === b.uuid) {

            p = b;
            w = a;

        }

        let direction = {

            x: Math.sign(p.AABB()[0].x - w.AABB()[0].x),
            y: Math.sign(p.AABB()[0].y - w.AABB()[0].y)

        }

        let vec = new Vec2();
        vec[intersect.key] = intersect.value * direction[intersect.key];

        p.moveTo(Vec2.sum(
            p.AABB()[0],
            vec
        ))

        // p.velocity = Vec2.sum(
        //     p.velocity,
        //     new Vec2(-p.velocity.x,
        //         -p.velocity.y))

    })

    PhysicsManager.Detector([player.bulletsPhysicsGroup, tilemap.group], (collision, a, b) => {

        let bullet;
        let tile

        if (a.parent == player.bulletsPhysicsGroup) {

            bullet = a;
            tile = b;

        }

        if (b.parent == player.bulletsPhysicsGroup) {

            bullet = b;
            tile = a;

        }

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

    PhysicsManager.Detector([player.bulletsPhysicsGroup, enemyGroup], (collision, a, b) => {

        a.owner.remove();
        b.owner.remove();

        spawnEnemy();

    })
    PhysicsManager.Detector([enemyGroup, tilemap.group], (collision, a, b) => {

        let enemy;
        let tile;

        if (a.parent == enemyGroup) {

            enemy = a;
            tile = b;

        }

        if (b.parent == enemyGroup) {

            enemy = b;
            tile = a;

        }

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
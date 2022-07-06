import { Scene, Graphics } from './modules/Scene.js';
import { AssetLoader, Sprite } from './modules/AssetLoader.js';
import { InputHandler } from './modules/InputHandler.js';
import { PhysicsModule, Physics } from './modules/Physics.js';
import { Player } from './modules/Game.js';
import { Vec2 } from './modules/Vec2.js';
import { TileMap } from './modules/Tilemap.js';
import { AnimationManager, Animation } from './modules/Animation.js';
import { Stats } from './modules/Stats.js';

document.addEventListener('DOMContentLoaded', async () => {

    let scene = new Scene({

        backgroundColor: "rgba(33, 33, 33, 1)"

    });

    scene.useModule(new Stats());
    const InputManager = scene.useModule(new InputHandler());
    const AssetManager = scene.useModule(new AssetLoader({
        // drawBounds: true
    }));
    const PhysicsManager = scene.useModule(new PhysicsModule({
        drawBodies: true
    }));

    AssetManager.loadSprite('tileset01', 'assets/images/tileset_test.png', 32, 32);

    AssetManager.loadSprite('player', 'assets/images/player.png');

    AssetManager.loadSprite('test_projectile', 'assets/images/player.png');

    AssetManager.loadTileMap('tilemap01', 'assets/tilemaps/map.json', 32, 32);

    await AssetManager.loaded();

    let tilesetSprite = AssetManager.getAsset('tileset01');
    let rawMap = AssetManager.getAsset('tilemap01');

    let tilemap = new TileMap(rawMap);
    tilemap.loadToScene(scene);

    console.log(tilemap.spawn);

    let player = new Player(scene, new Vec2(64, 64));

    // PhysicsManager.Detector([player, tilemap.group], (...params) => {

    //     // console.log(...params);

    // })

    // PhysicsManager.Detector([player.bulletsPhysicsGroup, tilemap.group], (...params) => {

    //     // console.log(...params);

    // })

});
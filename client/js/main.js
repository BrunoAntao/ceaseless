import { Scene, GraphicObject } from '/js/modules/scene.js';
import { AssetLoader, Sprite } from '/js/modules/AssetLoader.js';
import { InputHandler } from '/js/modules/InputHandler.js';
import { PhysicsModule, Physics, Entity } from '/js/modules/Physics.js';
import { Player } from '/js/modules/Game.js';
import { Vec2 } from '/js/modules/Vec2.js';
import { TileMap } from '/js/modules/Tilemap.js';

document.addEventListener('DOMContentLoaded', async () => {

    let scene = new Scene({

        backgroundColor: "rgba(33, 33, 33, 1)"

    });

    const Loader = scene.useModule(new AssetLoader());
    scene.useModule(new InputHandler());
    const PhysicsManager = scene.useModule(new PhysicsModule({ drawBodies: true }));

    Loader.loadSprite('player', 'assets/player.png', 16, 16);

    await Loader.loaded();

    let player = new Player(scene, new Vec2(64, 64));
    let enemy = new Entity(scene, 'player', new Vec2(128, 64));

    // let tilemap = new TileMap();

    // tilemap.loadToScene(scene);

    // PhysicsManager.Detector([tilemap.group, player], () => {

    //     player.position.x++;

    // })

    // Physics.Detector(scene, [player.bulletsPhysicsGroup, enemy], () => {

    //     enemy.remove();

    // })

    PhysicsManager.Detector([player, enemy], () => {

        enemy.remove();

    })

    scene.update = () => {

    }

});
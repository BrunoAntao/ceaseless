import { Scene, Graphics } from './modules/Scene.js';
import { AssetLoader, Sprite } from './modules/AssetLoader.js';
import { InputHandler } from './modules/InputHandler.js';
import { PhysicsModule, Physics } from './modules/Physics.js';
// import { Player } from './modules/Game.js';
import { Vec2 } from './modules/Vec2.js';
// import { TileMap } from './modules/Tilemap.js';
import { AnimationManager, Animation } from './modules/Animation.js';
import { Stats } from './modules/Stats.js';

document.addEventListener('DOMContentLoaded', async () => {

    let scene = new Scene({

        backgroundColor: "rgba(33, 33, 33, 1)"

    });

    scene.useModule(new Stats());
    scene.useModule(new InputHandler());

    const AssetManager = scene.useModule(new AssetLoader({
        drawBounds: true
    }));

    AssetManager.loadSprite('player', 'assets/test_projectile.png', 16, 4);

    await AssetManager.loaded();

    let bullet = new Sprite(scene, 'player', new Vec2(128, 64));
    bullet.scale = new Vec2(5, 5);
    bullet.anchor = new Vec2(1, 0.5);

    let bulletAM = new AnimationManager(bullet);
    bulletAM.add('test', new Animation([0, 1, 2, 3], { frameRate: 30 }));
    bulletAM.play('test');

    scene.update = () => {

        bullet.angle += 0.01;

        let dx = Math.cos(bullet.angle) * 1;
        let dy = Math.sin(bullet.angle) * 1;

        bullet.position.sum(new Vec2(dx, dy));

    }

    // const PhysicsManager = scene.useModule(new PhysicsModule({
    //     drawBodies: true
    // }));

    // AssetManager.loadSprite('tile', 'assets/tile.png');
    // AssetManager.loadSprite('player', 'assets/player.png');
    // AssetManager.loadSprite('test', 'assets/test.png');
    // AssetManager.loadSpriteSheet('test_projectile', 'assets/test_projectile.png', 16, 16, 4);

    // await AssetManager.loaded();

    // let animation = new Animation(AnimationManager);

    // console.log(animation);

});
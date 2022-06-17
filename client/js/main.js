import { Scene, GraphicObject } from '/js/modules/scene.js';
import { AssetLoader, Sprite } from '/js/modules/AssetLoader.js';
import { Vec2 } from '/js/modules/Vec2.js';

document.addEventListener('DOMContentLoaded', async (event) => {

    let scene = new Scene({

        backgroundColor: "rgba(33, 33, 33, 1)",

        // drawBodies: true

    });

    const loader = scene.useModule(new AssetLoader());

    loader.loadSprite('player', '/assets/player.png', 16, 16);

    await loader.loaded();

    let sp = new Sprite(scene, 'player', new Vec2(0, 0));

    // const { InputHandler } = await import('/js/modules/InputHandler.js');
    // const { AssetLoader } = await import('/js/modules/AssetLoader.js');
    // const { Physics } = await import('/js/modules/Physics.js');

    // scene.useModule(new InputHandler());
    // scene.useModule(new Physics.Module());

    // let player = new Player(scene, new Vec2(64, 64));
    // let enemy = new Entity(scene, new Vec2(128, 64));

    // Physics.Detector(scene, [player.bulletsPhysicsGroup, enemy], () => {

    //     enemy.remove();

    // })

    // Physics.Detector(scene, [player, enemy], () => {

    //     enemy.remove();

    // })

    let direction = { x: 1, y: 1 };

    scene.update = () => {

        if (sp.position.x > scene.canvas.width - sp.width) {

            direction.x = -1;

        }

        if (sp.position.y > scene.canvas.height - sp.height) {

            direction.y = -1;

        }

        if (sp.position.x < 0) {

            direction.x = 1;

        }

        if (sp.position.y < 0) {

            direction.y = 1;

        }

        sp.position.x += direction.x;
        sp.position.y += direction.y;

    }

});
import { Scene, Graphics } from '/js/modules/scene.js';
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

    // let enemy = new Entity(scene, 'player', new Vec2(128, 64));

    let tilemap = new TileMap();

    tilemap.loadToScene(scene);

    console.log(tilemap.spawn);
    let player = new Player(scene, tilemap.spawn);

    for (const object of scene.objects) {

        object.cull();

    }

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

    scene.update = () => {

    }

});
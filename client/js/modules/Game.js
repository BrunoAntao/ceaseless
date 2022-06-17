import { Physics, Entity } from '/js/modules/Physics.js';
import { Vec2 } from '/js/modules/Vec2.js';

export class Player extends Entity {

    constructor(scene, position = new Vec2()) {

        super(scene, 'player', position)

        this.anchor = new Vec2(0.5, 0.5);

        this.fireRate = 100;
        this.lastFire = 0;

        this.bulletsPhysicsGroup = new Physics.Group();

    }

    move(vec = new Vec2()) {

        this.position = Vec2.sum(this.position, vec);

    }

    update() {

        super.update();

        if (this.scene.Modules.InputHandler) {

            if (this.scene.Modules.InputHandler.keys["w"]) {

                this.move(new Vec2(0, -1));

            }

            if (this.scene.Modules.InputHandler.keys["s"]) {

                this.move(new Vec2(0, 1));

            }

            if (this.scene.Modules.InputHandler.keys["a"]) {

                this.move(new Vec2(-1, 0));

            }

            if (this.scene.Modules.InputHandler.keys["d"]) {

                this.move(new Vec2(1, 0));

            }

            //     if (this.scene.Modules.InputHandler.mouse.left) {

            //         if (Date.now() - this.lastFire > this.fireRate) {
            //             let projectile = new Projectile(this.scene, this.position.clone(), this.position.angleBetween(new Vec2(this.scene.Modules.InputHandler.mouse.x, this.scene.Modules.InputHandler.mouse.y)));
            //             this.bulletsPhysicsGroup.add(projectile.getBody());
            //             this.lastFire = Date.now();
            //         }
            //     }

        }

    }

}
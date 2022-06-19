import { Physics, Entity, Projectile } from './Physics.js';
import { Vec2 } from './Vec2.js';

export class Player extends Entity {

    constructor(scene, position = new Vec2()) {

        super(scene, 'player', position)

        this.anchor = new Vec2(0.5, 0.5);

        this.fireRate = 100;
        this.lastFire = 0;

        this.velocity = 0.6;

        this.bulletsPhysicsGroup = new Physics.Group();

    }

    move(vec = new Vec2()) {

        let body = this.getBody();
        body.velocity = Vec2.sum(body.velocity, vec);

    }

    update() {

        super.update();

        if (this.scene.Modules.InputHandler) {

            if (this.scene.Modules.InputHandler.keys["w"]) {

                this.move(new Vec2(0, -this.velocity));

            }

            if (this.scene.Modules.InputHandler.keys["s"]) {

                this.move(new Vec2(0, this.velocity));

            }

            if (this.scene.Modules.InputHandler.keys["a"]) {

                this.move(new Vec2(-this.velocity, 0));

            }

            if (this.scene.Modules.InputHandler.keys["d"]) {

                this.move(new Vec2(this.velocity, 0));

            }

            if (this.scene.Modules.InputHandler.mouse.left) {

                if (Date.now() - this.lastFire > this.fireRate) {
                    let pos = this.position.clone();

                    pos.x -= this.anchor.x * this.width;
                    pos.y -= this.anchor.y * this.height;

                    // console.log(this.position);

                    let projectile = new Projectile(this.scene, pos, this.position.angleBetween(new Vec2(this.scene.Modules.InputHandler.mouse.x, this.scene.Modules.InputHandler.mouse.y)));
                    this.bulletsPhysicsGroup.add(projectile.getBody());
                    this.lastFire = Date.now();
                }
            }

        }

    }

}
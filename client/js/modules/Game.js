import { Physics } from './Physics.js';
import { Sprite } from './AssetLoader.js';
import { Vec2 } from './Vec2.js';

export class Projectile extends Sprite {

    constructor(scene, key, position = new Vec2(), angle = 0) {

        super(scene, key, position);

        this.anchor = new Vec2(0.5, 0.5);

        this.angle = angle;

        this.body = new Physics.Body().attach(this);

        this.speed = 2;
        this.distance = 0;
        this.lifeSpan = 200;

    }

    update() {

        let dx = Math.cos(this.angle) * this.speed;
        let dy = Math.sin(this.angle) * this.speed;

        this.body.velocity = new Vec2(dx, dy);

        this.distance += Math.sqrt(dx * dx + dy * dy);

        if (this.distance > this.lifeSpan) {

            this.remove();

        }

        super.update();

    }

}

export class Player extends Sprite {

    constructor(scene, position = new Vec2()) {

        super(scene, 'player', position)

        this.anchor = new Vec2(0.5, 0.5);

        this.fireRate = 100;
        this.lastFire = 0;

        this.velocity = 0.6;

        this.bulletsPhysicsGroup = new Physics.Group();

        this.body = new Physics.Body().attach(this);

        this.hp = 10;
        this.lastDamage = 0;
        this.iWindow = 500;

    }

    damage(damage) {

        if (Date.now() - this.lastDamage > this.iWindow) {

            this.hp -= damage;
            this.lastDamage = Date.now();

        }

    }

    move(vec = new Vec2()) {

        this.body.velocity = Vec2.sum(this.body.velocity, vec);

    }

    update() {

        super.update();

        if (this.hp < 1) {

            this.remove();

        }

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

                    let projectile = new Projectile(
                        this.scene,
                        'test_projectile',
                        this.position.clone(),
                        this.position.angleBetween(
                            new Vec2(
                                this.scene.Modules.InputHandler.mouse.x,
                                this.scene.Modules.InputHandler.mouse.y
                            )
                        )
                    );

                    // projectile.scale = new Vec2(4, 4);

                    this.bulletsPhysicsGroup.add(projectile.body);
                    this.lastFire = Date.now();
                }
            }

        }

    }

}
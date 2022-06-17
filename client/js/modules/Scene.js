import { Vec2 } from '/client/js/modules/Vec2.js';

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export class Scene {

    constructor(options) {

        this.options = Object.assign({

            width: 800,
            height: 600,

            backgroundColor: "rgba(0,0,0,0)",

            container: document.body,

            drawBodies: false

        }, options);

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.ctx = this.canvas.getContext("2d");
        this.options.container.append(this.canvas);

        this.objects = [];
        this.bodies = [];

        this.Modules = {};

        this.lastCalledTime;
        this.lastTimestamp;
        this.fps;

        this.ctx.font = "20px Arial";
        this.textMetrics = this.ctx.measureText(this.fps);

        requestAnimationFrame(() => { this.render() });

    }

    useModule(module) {

        this.Modules[module.name] = module;
        module.register();

        return this.Modules[module.name];

    }

    renderFPS() {

        if (!this.lastCalledTime) {

            this.lastTimestamp = performance.now();
            this.lastCalledTime = performance.now();
            this.fps = 0;
            return;

        }

        let delta = (performance.now() - this.lastCalledTime) / 1000;

        this.lastCalledTime = performance.now();

        if (performance.now() - this.lastTimestamp > 1000) {

            this.lastTimestamp = performance.now();
            this.fps = "FPS: " + Math.floor(1 / delta);

        }

    }

    update() { }

    physicsUpdate() {

        this.update();

        for (let i = 0; i < this.bodies.length; i++) {

            const a = this.bodies[i];

            for (let j = i + 1; j < this.bodies.length; j++) {

                const b = this.bodies[j];

                const collision = a.collides[b.uuid];

                if (collision) {

                    if (a instanceof Physics.Group) {

                        if (b instanceof Physics.Group) {

                            for (const A of a.bodies) {

                                for (const B of b.bodies) {

                                    Physics.collisionUpdate(A, B, collision);

                                }

                            }

                        } else {

                            for (const A of a.bodies) {

                                Physics.collisionUpdate(A, b, collision);

                            }

                        }

                    } else {

                        Physics.collisionUpdate(a, b, collision);

                    }

                }

            }

        }

    }

    render() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#ffffff";

        this.ctx.fillText(this.fps, 8, 8 + this.textMetrics.actualBoundingBoxAscent);

        this.physicsUpdate();

        for (const object of this.objects) {

            object.update && object.update();
            object.render();

        }

        if (this.options.drawBodies) {

            for (const body of this.bodies) {

                if (body instanceof Physics.Group) {

                    for (const a of body.bodies) {

                        Graphics.DrawPath(this, a);

                    }

                } else {

                    Graphics.DrawPath(this, body);

                }

            }

        }

        this.renderFPS();

        requestAnimationFrame(() => { this.render() });

    }

}

export class GraphicObject {

    constructor(scene, position = new Vec2()) {

        this.scene = scene;
        this.scene.objects.push(this);
        this.position = position;

    }

    remove() {

        this.scene.objects.splice(this.scene.objects.indexOf(this), 1);

    }

    render() { }

}

const Graphics = {};

Graphics.DrawPath = (scene, body) => {

    scene.ctx.strokeStyle = '#ff00ff';

    scene.ctx.beginPath();

    const first = body.vecs[0];

    scene.ctx.moveTo(first.x, first.y);

    for (let i = 1; i < body.vecs.length; i++) {

        const vec = body.vecs[i];

        scene.ctx.lineTo(vec.x, vec.y);

    }

    scene.ctx.closePath();

    scene.ctx.stroke();

}

// class Entity extends Sprite {

//     constructor(scene, key, position = new Vec2()) {

//         super(scene, key, position)

//         this.body = new Physics.Body.Square(this.asset.image.width);
//         this.body.parent = scene;
//         this.body.moveTo(this);

//     }

//     remove() {

//         this.body.remove();
//         super.remove();

//     }

//     getBody() {

//         return this.body;

//     }

//     collides() { }

//     update() {

//         this.body.moveTo(this);

//     }

// }

// class Player extends Entity {

//     constructor(scene, position = new Vec2()) {

//         super(scene, 'player', position)

//         this.anchor = new Vec2(0.5, 0.5);

//         this.fireRate = 100;
//         this.lastFire = 0;

//         this.bulletsPhysicsGroup = new Physics.Group();

//     }

//     move(vec = new Vec2()) {

//         this.position = Vec2.sum(this.position, vec);

//     }

//     update() {

//         super.update();

//         if (this.scene.Modules.InputHandler) {

//             if (this.scene.Modules.InputHandler.keys["w"]) {

//                 this.move(new Vec2(0, -1));

//             }

//             if (this.scene.Modules.InputHandler.keys["s"]) {

//                 this.move(new Vec2(0, 1));

//             }

//             if (this.scene.Modules.InputHandler.keys["a"]) {

//                 this.move(new Vec2(-1, 0));

//             }

//             if (this.scene.Modules.InputHandler.keys["d"]) {

//                 this.move(new Vec2(1, 0));

//             }

//             //     if (this.scene.Modules.InputHandler.mouse.left) {

//             //         if (Date.now() - this.lastFire > this.fireRate) {
//             //             let projectile = new Projectile(this.scene, this.position.clone(), this.position.angleBetween(new Vec2(this.scene.Modules.InputHandler.mouse.x, this.scene.Modules.InputHandler.mouse.y)));
//             //             this.bulletsPhysicsGroup.add(projectile.getBody());
//             //             this.lastFire = Date.now();
//             //         }
//             //     }

//         }

//     }

// }

// class Projectile extends Entity {

//     constructor(scene, position = new Vec2(), angle = 0) {

//         super(scene, position);

//         this.angle = angle;
//         this.speed = 10;

//         this.distance = 0;
//         this.lifeSpan = 500;

//     }

//     render() {

//         let dx = Math.cos(this.angle) * this.speed;
//         let dy = Math.sin(this.angle) * this.speed;

//         this.position.x += dx;
//         this.position.y += dy;

//         this.distance += Math.sqrt(dx * dx + dy * dy);

//         if (this.distance > this.lifeSpan) {

//             this.remove();

//         }

//         super.render();

//     }

// }
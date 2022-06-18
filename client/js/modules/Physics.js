import { Module } from "/js/modules/Module.js";
import { Sprite } from "/js/modules/AssetLoader.js";
import { Vec2 } from "/js/modules/Vec2.js";
import { Intersect } from "/js/modules/Intersect.js";
import { Graphics } from "/js/modules/Scene.js";

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export const Physics = {};

export class PhysicsModule extends Module {

    constructor(options) {

        super('Physics', options);

        this.bodies = [];

        this.friction = 0.8;

    }

    update() {

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

        if (this.options.drawBodies) {

            for (const body of this.bodies) {

                if (body instanceof Physics.Group) {

                    for (const a of body.bodies) {

                        Graphics.DrawPath(this.scene, a);

                    }

                } else {

                    Graphics.DrawPath(this.scene, body);

                }

            }

        }

    }

    Detector([a, b], cb) {

        let A = (a instanceof Physics.Group && a) || a.getBody();
        let B = (b instanceof Physics.Group && b) || b.getBody();

        this.bodies.indexOf(A) == -1 && this.bodies.push(A);
        this.bodies.indexOf(B) == -1 && this.bodies.push(B);

        A.collides[B.uuid] = { body: B, cb };
        B.collides[A.uuid] = { body: A, cb };

    }

}

Physics.Body = class {

    constructor(vecs = []) {

        this.uuid = uuidv4();

        this.rvecs = vecs;
        this.vecs = vecs;

        this.velocity = new Vec2();

        this.collides = {};

    }

    update() {

        this.velocity.x *= this.manager.friction;
        this.velocity.y *= this.manager.friction;

        if (Math.abs(this.velocity.x) < 0.1) {

            this.velocity.x = 0;

        }

        if (Math.abs(this.velocity.y) < 0.1) {

            this.velocity.y = 0;

        }

        this.moveTo(Vec2.sum(this.AABB()[0], this.velocity));

    }

    remove() {

        if (this.parent) {

            this.parent.bodies.splice(this.parent.bodies.indexOf(this), 1);

        }

    }

    moveTo(position) {

        if (position instanceof Entity) {

            position = Vec2.sum(position.position, new Vec2(-position.anchor.x * position.width, -position.anchor.y * position.height))

        }

        let nvecs = [];

        for (let i = 0; i < this.rvecs.length; i++) {

            const vec = this.rvecs[i];

            nvecs[i] = Vec2.sum(vec, position);

        }

        this.vecs = nvecs;

    }

    getOffset() {

        let xMin = Infinity;
        let yMin = Infinity;
        let xMax = -Infinity;
        let yMax = -Infinity;

        for (const vec of this.vecs) {

            if (vec.x < xMin) {

                xMin = vec.x;

            }

            if (vec.y < yMin) {

                yMin = vec.y;

            }

            if (vec.x > xMax) {

                xMax = vec.x;

            }

            if (vec.y > yMax) {

                yMax = vec.y;

            }

        }

        const xDelta = xMax - xMin;
        const yDelta = yMax - yMin;

        if (xDelta < yDelta) {

            return { key: 'x', value: xDelta };

        } else {

            return { key: 'y', value: yDelta };

        }

    }

    AABB() {

        let xMin = Infinity;
        let yMin = Infinity;
        let xMax = -Infinity;
        let yMax = -Infinity;

        for (const vec of this.vecs) {

            if (vec.x < xMin) {

                xMin = vec.x;

            }

            if (vec.y < yMin) {

                yMin = vec.y;

            }

            if (vec.x > xMax) {

                xMax = vec.x;

            }

            if (vec.y > yMax) {

                yMax = vec.y;

            }

        }

        return [

            new Vec2(xMin, yMin),
            new Vec2(xMax, yMin),
            new Vec2(xMax, yMax),
            new Vec2(xMin, yMax),

        ]

    }

}

Physics.Body.Square = class extends Physics.Body {

    constructor(size) {

        let vecs = [
            new Vec2(0, 0),
            new Vec2(size, 0),
            new Vec2(size, size),
            new Vec2(0, size),
        ]

        super(vecs);

    }

}

Physics.collides = (a, b) => {

    return Intersect(a.vecs, b.vecs);

}

Physics.AABBcollides = (a, b) => {

    return Intersect(a.AABB(), b.AABB());

}

Physics.collisionUpdate = (a, b, collision) => {

    if (Physics.AABBcollides(a, b).length > 0) {

        // console.log('AABB collides');

        let col = Physics.collides(a, b);

        if (col.length > 0) {

            // console.log('collides');

            collision.cb(col, a, b);

        }

    }

}

Physics.Group = class {

    constructor() {

        this.collides = {};

        this.bodies = [];

    }

    add(body) {

        body.parent = this;
        this.bodies.push(body);

    }

}

export class Entity extends Sprite {

    constructor(scene, key, position = new Vec2()) {

        super(scene, key, position)

        this.body = new Physics.Body.Square(this.asset.image.width);
        this.body.manager = scene.Modules.Physics;
        this.body.parent = scene.Modules.Physics;
        this.body.moveTo(position);

    }

    remove() {

        this.body.remove();
        super.remove();

    }

    getBody() {

        return this.body;

    }

    collides() { }

    update() {

        this.body.update();

        let pos = this.body.AABB()[0];

        this.position.x = pos.x + this.anchor.x * this.width;
        this.position.y = pos.y + this.anchor.y * this.height;

    }

}
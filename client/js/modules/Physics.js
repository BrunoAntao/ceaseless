import { Module } from "./Module.js";
import { Sprite } from "./AssetLoader.js";
import { Vec2 } from "./Vec2.js";
import { Intersect } from "./Intersect.js";
import { Graphics } from "./Scene.js";

let GUIDC = 0;

function uuidv4() {

    return GUIDC++;

    // return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    //     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    // );
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

                        if (b instanceof Physics.Group) {

                            for (const B of b.bodies) {

                                Physics.collisionUpdate(a, B, collision);

                            }

                        } else {

                            Physics.collisionUpdate(a, b, collision);

                        }

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

        let subcb = (collision, a, b) => {

            // let sa = (A instanceof Physics.Group && a.parent) || a;
            let sb = (B instanceof Physics.Group && b.parent) || b;

            let na = a;
            let nb = b;

            if (A === sb) {

                na = b;
                nb = a;

            }

            cb(collision, na, nb);

        }

        A.collides[B.uuid] = { body: B, cb: subcb };
        B.collides[A.uuid] = { body: A, cb: subcb };

    }

    collidesWith([a, b]) {
        this.Detector([a, b], (collision, a, b) => {

            let intersect = new Physics.Body(collision[0]).getOffset();

            if (a.options && a.options.immovable) {

                let direction = {

                    x: Math.sign(b.AABB()[0].x - a.AABB()[0].x),
                    y: Math.sign(b.AABB()[0].y - a.AABB()[0].y)

                }

                let vec = new Vec2();
                vec[intersect.key] = intersect.value * direction[intersect.key];

                b.moveTo(Vec2.sum(
                    b.AABB()[0],
                    vec
                ))

            }

            if (b.options && b.options.immovable) {

                let direction = {

                    x: Math.sign(a.AABB()[0].x - b.AABB()[0].x),
                    y: Math.sign(a.AABB()[0].y - b.AABB()[0].y)

                }

                let vec = new Vec2();
                vec[intersect.key] = intersect.value * direction[intersect.key];

                a.moveTo(Vec2.sum(
                    a.AABB()[0],
                    vec
                ))

            }

        })
    }

}

Physics.Body = class {

    constructor(vecs = []) {

        this.uuid = uuidv4();

        this.rvecs = vecs;
        this.vecs = vecs;

        this.angle = 0;

        this.velocity = new Vec2();

        this.collides = {};

    }

    update() {

        if (this.owner instanceof Projectile) {

            let ab = this.AABB();

            let a = ab[0];
            let b = ab[2];

            let hx = (a.x + b.x) / 2;
            let hy = (a.y + b.y) / 2;

            this.rotateTo(this.owner.angle, new Vec2(hx, hy));
        }

        this.velocity.x *= this.manager.friction;
        this.velocity.y *= this.manager.friction;

        if (Math.abs(this.velocity.x) < 0.1) {

            this.velocity.x = 0;

        }

        if (Math.abs(this.velocity.y) < 0.1) {

            this.velocity.y = 0;

        }

        // this.moveTo(Vec2.sum(this.AABB()[0], this.velocity));

        for (let i = 0; i < this.vecs.length; i++) {

            const vec = this.vecs[i];
            vec.x += this.velocity.x;
            vec.y += this.velocity.y;

        }

    }

    rotate(angle = new Angle(), center = new Vec2()) {

        for (let i = 0; i < this.vecs.length; i++) {

            this.vecs[i].rotate(angle, center);

        }

    }

    rotateTo(angle = new Angle(), center = new Vec2()) {

        if (angle - this.angle != Number.EPSILON) {

            this.rotate(angle - this.angle, center);
            this.angle = angle;

        }

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

    let aAABB = a.AABB();
    let bAABB = b.AABB();

    if (aAABB[0].x < bAABB[2].x &&
        aAABB[2].x > bAABB[0].x &&
        aAABB[0].y < bAABB[2].y &&
        aAABB[2].y > bAABB[0].y) {

        return true;

    }

    return false;

}

Physics.collisionUpdate = (a, b, collision) => {

    if (Physics.AABBcollides(a, b)) {

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

        this.uuid = uuidv4();

        this.collides = {};

        this.bodies = [];

    }

    add(body) {

        body.parent = this;
        this.bodies.push(body);

    }

}

export class Entity extends Sprite {

    constructor(scene, key, position = new Vec2(), options = {}) {

        super(scene, key, position)

        this.body = new Physics.Body.Square(this.asset.image.width);
        this.body.options = options;
        this.body.manager = scene.Modules.Physics;
        this.body.parent = scene.Modules.Physics;
        this.body.owner = this;
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

    render() {

        let pos = this.body.AABB()[0];

        this.position.x = pos.x + this.anchor.x * this.width;
        this.position.y = pos.y + this.anchor.y * this.height;

        super.render();

    }

}

export class Projectile extends Entity {

    constructor(scene, position = new Vec2(), angle = 0) {

        super(scene, 'player', position);

        this.angle = angle;
        this.speed = 10;
        this.anchor = { x: 0.5, y: 0.5 };

        this.distance = 0;
        this.lifeSpan = 500;

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

    render() {

        super.render();

    }

}
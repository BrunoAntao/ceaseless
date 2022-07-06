import { Module } from "./Module.js";
import { Sprite } from "./AssetLoader.js";
import { Vec2 } from "./Vec2.js";
import { Intersect, AABBIntersect } from "./Intersect.js";
import { Graphics } from "./Scene.js";
import { Angle } from "./Angle.js";

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

                        Graphics.DrawPath(this.scene, a.vecs);

                    }

                } else {

                    Graphics.DrawPath(this.scene, body.vecs);

                }

            }

        }

    }

    Detector([a, b], cb) {

        let A = (a instanceof Physics.Group && a) || a.body;
        let B = (b instanceof Physics.Group && b) || b.body;

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

            if (a.options && a.options.Physics && a.options.Physics.immovable) {

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

            if (b.options && b.options.Physics && b.options.Physics.immovable) {

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

    constructor(vecs = [], options = {}) {

        this.uuid = uuidv4();

        this.rvecs = vecs;
        this.vecs = [...this.rvecs];

        this.anchor = new Vec2(0, 0);

        this.options = options;

        this.angle = 0;

        this.velocity = new Vec2();

        this.collides = {};

    }

    attach(graphicObject) {

        this.rvecs = graphicObject.bounds.rvecs;
        this.anchor = graphicObject.anchor;
        graphicObject.anchor = new Vec2(0, 0);

        this.manager = graphicObject.scene.Modules.Physics;
        this.parent = graphicObject.scene.Modules.Physics;
        this.owner = graphicObject;

        this.moveTo(
            new Vec2(
                graphicObject.position.x - graphicObject.anchor.x * graphicObject.asset.frameWidth,
                graphicObject.position.y - graphicObject.anchor.y * graphicObject.asset.frameHeight
            )
        );

        const oUpdate = graphicObject.update;
        graphicObject.update = () => {

            this.update();
            oUpdate.call(graphicObject);

        }

        const oRender = graphicObject.render;
        graphicObject.render = () => {

            let pos = this.vecs[0];

            graphicObject.position.x = pos.x;
            graphicObject.position.y = pos.y;

            oRender.call(graphicObject);

        }

        const oRemove = graphicObject.remove;

        graphicObject.remove = () => {

            this.remove();
            oRemove.call(graphicObject);

        }

        return this;

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

        for (let i = 0; i < this.vecs.length; i++) {

            const vec = this.vecs[i];
            vec.x += this.velocity.x;
            vec.y += this.velocity.y;

        }

        let ab = this.AABB()[0];

        this.rotateTo(this.owner.angle,
            new Vec2(
                ab.x + this.anchor.x * this.owner.asset.frameWidth,
                ab.y + this.anchor.y * this.owner.asset.frameHeight
            )
        );

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

        if (this.parent && this.parent.bodies.indexOf(this) > -1) {

            this.parent.bodies.splice(this.parent.bodies.indexOf(this), 1);

        }

    }

    moveTo(position) {

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

    constructor(size, options) {

        let vecs = [
            new Vec2(0, 0),
            new Vec2(size, 0),
            new Vec2(size, size),
            new Vec2(0, size),
        ]

        super(vecs, options);

    }

}

Physics.Body.Rectangle = class extends Physics.Body {

    constructor(width, height, options) {

        let vecs = [
            new Vec2(0, 0),
            new Vec2(width, 0),
            new Vec2(width, height),
            new Vec2(0, height),
        ]

        super(vecs, options);

    }

}

Physics.collides = (a, b) => {

    return Intersect([...a.vecs], [...b.vecs]);

}

Physics.AABBcollides = (a, b) => {

    let aAABB = a.AABB();
    let bAABB = b.AABB();

    return AABBIntersect(aAABB, bAABB);

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
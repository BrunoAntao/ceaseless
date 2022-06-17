import { Module } from "/client/js/modules/Module.js";

export const Physics = {};

Physics.Module = class extends Module {

    constructor() {

        super('Physics');

    }

}

Physics.Body = class {

    constructor(vecs = []) {

        this.uuid = uuidv4();

        this.rvecs = vecs;
        this.vecs = vecs;

        this.collides = {};

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

    return intersect(a.vecs, b.vecs);

}

Physics.AABBcollides = (a, b) => {

    return intersect(a.AABB(), b.AABB());

}

Physics.collisionUpdate = (a, b, collision) => {

    if (Physics.AABBcollides(a, b).length > 0) {

        // console.log('AABB collides');

        if (Physics.collides(a, b).length > 0) {

            // console.log('collides');

            collision.cb();

        }

    }

}

Physics.Detector = (scene, [a, b], cb) => {

    let A = (a instanceof Physics.Group && a) || a.getBody();
    let B = (b instanceof Physics.Group && b) || b.getBody();

    scene.bodies.indexOf(A) == -1 && scene.bodies.push(A);
    scene.bodies.indexOf(B) == -1 && scene.bodies.push(B);

    A.collides[B.uuid] = { body: B, cb };
    B.collides[A.uuid] = { body: A, cb };

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
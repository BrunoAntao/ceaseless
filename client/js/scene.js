function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

class Scene {

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

        module(this);

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

class Angle {

    constructor(radians = 0) {

        if (radians instanceof Angle) {

            this.value = radians.valueOf();

        } else {

            this.value = radians;

        }

    }

    valueOf() {

        return this.value;

    }

    toDegrees() {

        return this.value * (180 / Math.PI);

    }

    setDegrees(degrees) {

        this.value = (degrees * Math.PI) / 180;

        return this.value;

    }

}

class Vec2 {

    constructor(x = 0, y = 0) {

        this.x = x;
        this.y = y;

    }

    static sum(vec1 = new Vec2(), vec2 = new Vec2()) {

        return new Vec2(vec1.x + vec2.x, vec1.y + vec2.y);

    }

    clone() {

        return new Vec2(this.x, this.y);

    }

    angleBetween(vec = new Vec2()) {

        return new Angle(Math.atan2(vec.y - this.y, vec.x - this.x));

    }

    rotate(angle = new Angle(), center = new Vec2()) {

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const oldX = this.x;
        const oldY = this.y;

        this.x = (oldX - center.x) * cos - (oldY - center.y) * sin + center.x;
        this.y = (oldX - center.x) * sin + (oldY - center.y) * cos + center.y;

    }

    rotateTo(angle = new Angle(), center = new Vec2()) {

        const currentAngle = this.angleBetween(center);

        if (angle - currentAngle != Number.EPSILON) {

            this.rotate(angle - currentAngle, center);

        }

    }

}

class GraphicObject {

    constructor(scene, position = new Vec2()) {

        this.scene = scene;
        this.scene.objects.push(this);
        this.position = position;

    }

    remove() {

        this.scene.objects.splice(this.scene.objects.indexOf(this), 1);

    }

}

class Sprite extends GraphicObject {

    constructor(scene, position = new Vec2()) {

        super(scene, position);

        this.anchor = new Vec2(0.5, 0.5);

        this.image = new Image();
        this.image.src = "assets/player.png";

        this.width = this.image.width;
        this.height = this.image.height;

    }

    render() {

        this.scene.ctx.drawImage(
            this.image,
            this.position.x - (this.anchor.x * this.width),
            this.position.y - (this.anchor.y * this.height)
        );

    }

}

class InputHandler {

    constructor() {

        this.keys = {}

        this.mouse = {

            x: 0,
            y: 0,

            left: false,
            middle: false,
            right: false

        };

        document.body.addEventListener("contextmenu", e => {

            e.preventDefault();

        })

        document.body.addEventListener("mousedown", e => {

            if (e.button === 0) {

                this.mouse.left = true;

            } else if (e.button === 1) {

                this.mouse.middle = true;

            } else if (e.button === 2) {

                this.mouse.right = true;

            }

        })

        document.body.addEventListener("mouseup", e => {

            if (e.button === 0) {

                this.mouse.left = false;

            } else if (e.button === 1) {

                this.mouse.middle = false;

            } else if (e.button === 2) {

                this.mouse.right = false;

            }

        })

        document.body.addEventListener("mousemove", e => {

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

        })

        document.body.addEventListener("keydown", e => {

            this.keys[e.key] = true;

        })

        document.body.addEventListener("keyup", e => {

            this.keys[e.key] = false;

        })

    }

    module() {

        return (scene) => {

            scene.Modules[this.constructor.name] = new this.constructor();

        }

    }

}

const Physics = {};

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

class Entity extends Sprite {

    constructor(scene, position = new Vec2()) {

        super(scene, position)

        this.body = new Physics.Body.Square(this.image.width);
        this.body.parent = scene;
        this.body.moveTo(this);

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

        this.body.moveTo(this);

    }

}

class Player extends Entity {

    constructor(scene, position = new Vec2()) {

        super(scene, position)

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

            if (this.scene.Modules.InputHandler.mouse.left) {

                if (Date.now() - this.lastFire > this.fireRate) {
                    let projectile = new Projectile(this.scene, this.position.clone(), this.position.angleBetween(new Vec2(this.scene.Modules.InputHandler.mouse.x, this.scene.Modules.InputHandler.mouse.y)));
                    this.bulletsPhysicsGroup.add(projectile.getBody());
                    this.lastFire = Date.now();
                }
            }

        }

    }

}

class Projectile extends Entity {

    constructor(scene, position = new Vec2(), angle = 0) {

        super(scene, position);

        this.angle = angle;
        this.speed = 10;

        this.distance = 0;
        this.lifeSpan = 500;

    }

    render() {

        let dx = Math.cos(this.angle) * this.speed;
        let dy = Math.sin(this.angle) * this.speed;

        this.position.x += dx;
        this.position.y += dy;

        this.distance += Math.sqrt(dx * dx + dy * dy);

        if (this.distance > this.lifeSpan) {

            this.remove();

        }

        super.render();

    }

}
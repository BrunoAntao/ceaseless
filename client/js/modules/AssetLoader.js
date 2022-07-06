import { Module } from "./Module.js";
import { AABBIntersect } from "./Intersect.js";
import { GraphicObject, Graphics } from "./Scene.js";
import { Vec2 } from './Vec2.js';

export class AssetLoader extends Module {

    constructor(options) {

        super('AssetLoader', options);

        this.assets = {};

    }

    register(scene) {

        super.register(scene);

        this.bounds = new Bounds(this.scene.canvas.width, this.scene.canvas.height);

    }

    load(key, assetPromise) {

        this.assets[key] = assetPromise;
        assetPromise.then(asset => {

            this.assets[key] = asset;

        })

    }

    loadSprite(key, path, frameWidth, frameHeight) {

        this.load(key, new Promise((resolve) => {

            let image = new Image();
            image.onload = () => {

                resolve({
                    key,
                    image,
                    path,
                    frameWidth: frameWidth || image.width,
                    frameHeight: frameHeight || image.height,

                    ...(frameWidth && { frames: image.width / frameWidth })

                });

            }
            image.src = path;

        }));

    }

    loadTileMap(key, path) {

        this.load(key, new Promise((resolve) => {

            fetch(path)
                .then(response => response.json())
                .then(data => resolve(data));

        }));

    }

    getAsset(key) {

        const asset = this.assets[key];

        if (!asset) {

            throw Error(`No assets with key: "${key}" loaded.`)

        }

        return asset;

    }

    loaded() {

        return Promise.all(Object.values(this.assets));

    }

}

class Bounds {

    constructor(width, height) {

        this.rwidth = width;
        this.rheight = height;

        this.width = width;
        this.height = height;

        this.rvecs = [
            new Vec2(0, 0),
            new Vec2(width, 0),
            new Vec2(width, height),
            new Vec2(0, height),
        ];

        this.vecs = [...this.rvecs];

    }

    rotate(angle = new Angle(), center = new Vec2()) {

        for (let i = 0; i < this.vecs.length; i++) {

            this.vecs[i].rotate(angle, center);

        }

    }

    rotateTo(angle = new Angle(), center = new Vec2()) {

        if (angle - this.angle !== Number.EPSILON) {

            this.rotate(angle - this.angle, center);
            this.angle = angle;

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

    scale(scale) {

        this.width = this.rwidth * scale.x;
        this.height = this.rheight * scale.y;

        this.rvecs = [
            new Vec2(0, 0),
            new Vec2(this.width, 0),
            new Vec2(this.width, this.height),
            new Vec2(0, this.height),
        ];

        this.vecs = [...this.rvecs];

    }

    update(sprite) {

        this.scale(sprite.scale);

        this.moveTo(new Vec2(

            sprite.position.x - this.width * sprite.anchor.x,
            sprite.position.y - this.height * sprite.anchor.y

        ))

        this.rotate(sprite.angle,
            new Vec2(
                sprite.position.x,
                sprite.position.y
            ));

    }

}

export class Sprite extends GraphicObject {

    constructor(scene, key, position = new Vec2()) {

        if (!scene.Modules.AssetLoader) {

            throw new Error('Module AssetLoader missing.');

        }

        super(scene, position);

        this.asset = scene.Modules.AssetLoader.getAsset(key);
        this.frame = 0;

        this.anchor = new Vec2(0, 0);
        this.scale = new Vec2(1, 1);

        this.angle = 0;

        this.bounds = new Bounds(
            this.asset.frameWidth,
            this.asset.frameHeight
        );

    }

    update() { }

    inBounds() {

        this.bounds.update(this);

        return AABBIntersect(
            this.scene.Modules.AssetLoader.bounds.AABB(),
            this.bounds.AABB()
        );

    }

    render() {

        this.scene.ctx.save();

        this.scene.ctx.translate(
            this.position.x,
            this.position.y
        );

        this.scene.ctx.rotate(this.angle);

        this.scene.ctx.translate(
            - this.anchor.x * this.asset.frameWidth * this.scale.x,
            - this.anchor.y * this.asset.frameHeight * this.scale.y
        );

        this.scene.ctx.scale(this.scale.x, this.scale.y);

        this.scene.ctx.drawImage(
            this.asset.image,
            this.frame * this.asset.frameWidth,
            0,
            this.asset.frameWidth,
            this.asset.frameHeight,
            0,
            0,
            this.asset.frameWidth,
            this.asset.frameHeight
        );

        this.scene.ctx.restore();

        if (this.scene.Modules.AssetLoader.options.drawBounds) {

            Graphics.DrawPath(this.scene, this.bounds.vecs, "#00ff00");
            Graphics.DrawPath(this.scene, this.bounds.AABB(), "#00ff00");

        }

    }

}
import { Module } from "./Module.js";
import { GraphicObject } from "./Scene.js";
import { Vec2 } from './Vec2.js';

export class AssetLoader extends Module {

    constructor() {

        super('AssetLoader');

        this.assets = {};

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

                resolve({ key, image, path, frameWidth, frameHeight });

            }
            image.src = path;

        }));

    }

    getAsset(key) {

        return this.assets[key];

    }

    loaded() {

        return Promise.all(Object.values(this.assets));

    }

}

export class Sprite extends GraphicObject {

    constructor(scene, key, position = new Vec2()) {

        super(scene, position);

        this.key = key;
        this.asset = scene.Modules.AssetLoader.getAsset(key);

        this.anchor = new Vec2(0, 0);

        this.width = this.asset.image.width;
        this.height = this.asset.image.height;

    }

    cull() {

        return this.position.x + this.width < 0 ||
            this.position.x > this.scene.canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y > this.scene.canvas.height;

    }

    update() { }

    render() {

        if (this.angle) {

            this.scene.ctx.save();

            this.scene.ctx.translate(this.position.x, this.position.y);
            this.scene.ctx.rotate(this.angle);

            this.scene.ctx.drawImage(
                this.asset.image,
                -(this.anchor.x * this.width),
                -(this.anchor.y * this.height)
            );

            this.scene.ctx.restore();

        } else {

            this.scene.ctx.drawImage(
                this.asset.image,
                this.position.x - (this.anchor.x * this.width),
                this.position.y - (this.anchor.y * this.height)
            );

        }

    }

}
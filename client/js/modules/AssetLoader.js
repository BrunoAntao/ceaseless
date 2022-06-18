import { Module } from "/js/modules/Module.js";
import { GraphicObject } from "/js/modules/Scene.js";
import { Vec2 } from '/js/modules/Vec2.js';

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

    update() { }

    render() {

        this.scene.ctx.drawImage(
            this.asset.image,
            this.position.x - (this.anchor.x * this.width),
            this.position.y - (this.anchor.y * this.height)
        );

    }

}
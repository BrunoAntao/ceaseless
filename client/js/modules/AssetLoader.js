import { Module } from "/js/modules/Module.js";

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
import { Vec2 } from './Vec2.js';

export class Scene {

    constructor(options) {

        this.options = Object.assign({

            width: 800,
            height: 600,

            backgroundColor: "rgba(0,0,0,0)",

            container: document.body,

        }, options);

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.ctx = this.canvas.getContext("2d");
        this.options.container.append(this.canvas);

        this.objects = [];

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
        module.register(this);

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

    render() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();

        for (const object of this.objects) {

            object.update && object.update();

        }

        const Modules = Object.values(this.Modules);

        for (const Module of Modules) {

            Module.update();

        }

        for (const object of this.objects) {

            if (!object.cull()) {

                object.render();

            }

        }

        for (const Module of Modules) {

            Module.render();

        }

        this.ctx.fillStyle = "#ffffff";

        this.ctx.fillText(this.fps, 8, 8 + this.textMetrics.actualBoundingBoxAscent);


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

        if (this.scene.objects.indexOf(this) > -1) {

            this.scene.objects.splice(this.scene.objects.indexOf(this), 1);

        }

    }

    render() { }

}

export const Graphics = {};

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
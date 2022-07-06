import { Vec2 } from './Vec2.js';

export class Scene {

    constructor(options) {

        this.options = Object.assign({

            width: 800,
            height: 600,

            // resize: true,
            // maintainAspectRatio: true,

            backgroundColor: "rgba(0,0,0,0)",

            container: document.body,

        }, options);

        // if (this.options.resize) {

        //     window.addEventListener('resize', () => {

        //         this.canvas.style.width = '100%';
        //         this.canvas.style.height = '100%';

        //         const bestRatio = Math.min(
        //             this.canvas.offsetWidth / this.canvas.width,
        //             this.canvas.offsetHeight / this.canvas.height);
        //         this.canvas.width *= bestRatio;
        //         this.canvas.height *= bestRatio;

        //         console.log(this.canvas.width);
        //         console.log(this.canvas.height);

        //     })

        // }

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.ctx = this.canvas.getContext("2d");
        this.options.container.append(this.canvas);

        this.ctx.imageSmoothingEnabled = false;
        let style = document.createElement('style');
        style.textContent = `
        canvas {
            image-rendering: -moz-crisp-edges;
            image-rendering: -webkit-crisp-edges;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
        }
        `
        document.head.appendChild(style);

        this.objects = [];

        this.Modules = {};

        requestAnimationFrame((step) => { this.render(step) });

    }

    useModule(module) {

        this.Modules[module.name] = module;
        module.register(this);

        return this.Modules[module.name];

    }

    update() { }

    render(step) {

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

            if (object.inBounds()) {

                for (const Module of Modules) {

                    Module.preRender(object);

                }

                object.render(step);

            }

        }

        for (const Module of Modules) {

            Module.render();

        }

        requestAnimationFrame((step) => { this.render(step) });

    }

}

export class GraphicObject {

    constructor(scene, position = new Vec2()) {

        this.scene = scene;
        this.scene.objects.push(this);
        this.position = position;

        this.Modules = {};

    }

    remove() {

        if (this.scene.objects.indexOf(this) > -1) {

            this.scene.objects.splice(this.scene.objects.indexOf(this), 1);

        }

    }

    render() { }

}

export const Graphics = {};

Graphics.DrawPath = (scene, vecs, color = '#ff0000') => {

    scene.ctx.strokeStyle = color;

    scene.ctx.beginPath();

    const first = vecs[0];

    scene.ctx.moveTo(first.x, first.y);

    for (let i = 1; i < vecs.length; i++) {

        const vec = vecs[i];

        scene.ctx.lineTo(vec.x, vec.y);

    }

    scene.ctx.closePath();

    scene.ctx.stroke();

}

Graphics.FillPath = (ctx, vecs, color = '#ff0000') => {

    ctx.fillStyle = color;

    ctx.beginPath();

    const first = vecs[0];

    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < vecs.length; i++) {

        const vec = vecs[i];

        ctx.lineTo(vec.x, vec.y);

    }

    ctx.closePath();

    ctx.fill();

}
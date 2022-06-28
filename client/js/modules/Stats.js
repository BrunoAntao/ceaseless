import { Module } from "./Module.js";

export class Stats extends Module {

    constructor() {

        super('Stats');

        this.lastCalledTime;
        this.lastTimestamp;
        this.fpsLabel = "FPS: 0";

    }

    register(scene) {

        super.register(scene);

        this.scene.ctx.font = "20px Arial";
        this.textMetrics = this.scene.ctx.measureText(this.fpsLabel);

    }

    update() {

        if (!this.lastCalledTime) {

            this.lastTimestamp = performance.now();
            this.lastCalledTime = performance.now();
            this.fpsLabel = "FPS: 0";
            return;

        }

        let delta = (performance.now() - this.lastCalledTime) / 1000;

        this.lastCalledTime = performance.now();

        if (performance.now() - this.lastTimestamp > 1000) {

            this.lastTimestamp = performance.now();
            this.fpsLabel = "FPS: " + Math.floor(1 / delta);

        }

    }

    render() {

        this.scene.ctx.fillStyle = "#ffffff";

        this.scene.ctx.fillText(this.fpsLabel,
            8,
            8 + this.textMetrics.actualBoundingBoxAscent);

    }

}
import { findPointInsidePolygon } from "./Intersect.js";
import { Module } from "./Module.js";
import { Graphics } from "./Scene.js";

const validEvents = ['mousedown', 'mouseup', 'mouseover', 'mouseout'];

const rgbToHex = (r, g, b) => {

    if (r > 255 || g > 255 || b > 255)

        throw "Invalid color component";

    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

}

let GUIDC = 1;

const generateHitColor = () => {

    return '#' + (GUIDC++).toString(16).padStart(6, "0");

}

class EventHandler {

    constructor(manager, parent) {

        this.manager = manager;
        this.parent = parent;
        this.events = {};

        this.hitColor = generateHitColor();

    }

    addEventListener(event, cb) {

        if (validEvents.includes(event)) {

            if (!this.events[event]) {

                this.events[event] = [];

            }

            this.events[event].push(cb);

        }

    }

    dispatchEvent(event) {

        if (this.events[event]) {

            for (const cb of this.events[event]) {

                cb({ target: this.parent, manager: this.manager });

            }

        }

    }

}

export class InputHandler extends Module {

    constructor() {

        super('InputHandler');

        this.hitCanvas = null;
        this.hitCtx = null;

        this.current = null;
        this.pcurrent = null;
        this.hitColor = null;

        this.keys = {};

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

            if (this.current && this.current.Modules.EventHandler) {

                this.current.Modules.EventHandler.dispatchEvent('mousedown');

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

            if (this.current && this.current.Modules.EventHandler) {

                this.current.Modules.EventHandler.dispatchEvent('mouseup');

            }

        })

        document.body.addEventListener("mousemove", e => {

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            this.hitColor = rgbToHex(...this.hitCtx.getImageData(this.mouse.x, this.mouse.y, 1, 1).data);

        })

        document.body.addEventListener("keydown", e => {

            if (!e.getModifierState('CapsLock')) {

                this.keys[e.key] = true;

            } else {

                this.keys[e.key.toLowerCase()] = true;

            }

        })

        document.body.addEventListener("keyup", e => {

            if (!e.getModifierState('CapsLock')) {

                this.keys[e.key] = false;

            } else {

                this.keys[e.key.toLowerCase()] = false;

            }

        })

    }

    register(scene) {

        this.hitCanvas = document.createElement('canvas');
        this.hitCanvas.width = scene.canvas.width;
        this.hitCanvas.height = scene.canvas.height;

        this.hitCtx = this.hitCanvas.getContext('2d');

        // document.body.append(this.hitCanvas);

        super.register(scene);

    }

    addEventHandler(objects) {

        if (Array.isArray(objects)) {

            for (const object of objects) {

                object.Modules.EventHandler = new EventHandler(this, object);

            }

        } else {

            objects.Modules.EventHandler = new EventHandler(this, objects);

        }

    }

    update() {

        this.pcurrent = this.current;
        this.current = null;

    }

    preRender(object) {

        if (object.Modules.EventHandler) {

            Graphics.FillPath(this.hitCtx, object.bounds.vecs, object.Modules.EventHandler.hitColor);

            if (this.pcurrent && this.pcurrent.Modules.EventHandler) {

                this.pcurrent.Modules.EventHandler.dispatchEvent('mouseout');

            }

            if (object.Modules.EventHandler.hitColor === this.hitColor) {

                this.current = object;

            }

            if (this.current && this.current.Modules.EventHandler) {

                this.current.Modules.EventHandler.dispatchEvent('mouseover');

            }

        }


    }

}
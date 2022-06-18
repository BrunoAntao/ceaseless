import { Module } from "/js/modules/Module.js";

export class InputHandler extends Module {

    constructor() {

        super('InputHandler');

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

}
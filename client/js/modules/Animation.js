export class AnimationManager {

    constructor(sprite) {

        this.sprite = sprite;
        this.sprite.Modules.AnimationManager = this;

        this.originalRender = sprite.render;

        this.lastRender = 0;

        this.sprite.render = (step) => {

            this.render(step, step - this.lastRender);
            this.lastRender = performance.now();
            this.originalRender.call(sprite);

        }

        this.current = new Animation();
        this.animations = {};

    }

    add(key, animation) {

        this.animations[key] = animation;

    }

    play(key) {

        const animation = this.animations[key];

        if (!animation) {

            throw Error(`No assets with key: "${key}" loaded.`)

        }

        this.current = animation;
        this.current.play();

    }

    pause() {

        this.current.renderCounter = 0;
        this.current.playing = false;

    }

    render(step, elapsedTime) {

        this.current.render(step, elapsedTime);

        this.sprite.frame = this.current.frame;

    }

}

export class Animation {

    constructor(frames = [0], options = {}) {

        this.options = Object.assign({

            frameRate: 60

        }, options);

        this.frame = frames[0];
        this.index = 0;
        this.frames = frames;
        this.renderCounter = 0;

        this.playing = false;

    }

    render(step, elapsedTime) {

        if (this.playing) {

            this.renderCounter += elapsedTime;

            if (this.options.frameRate > 0 && this.renderCounter > 1000 / this.options.frameRate) {

                this.index++;

                if (this.index > this.frames.length - 1) {

                    this.index = 0;

                }

                this.frame = this.frames[this.index];

                this.renderCounter = 0;

            }

        }

    }

    play() {

        this.frames[0];
        this.renderCounter = 0;
        this.playing = true;

    }

}
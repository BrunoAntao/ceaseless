export class Module {

    constructor(name, options = {}) {

        this.name = name;
        this.options = options;

    }

    update() { }
    preRender() { }
    render() { }

    register(scene) {

        this.scene = scene;

        console.log(`Module ${this.name} loaded.`);

    }

}
export class Module {

    constructor(name) {

        this.name = name;

    }

    register() {

        console.log(`Module ${this.name} loaded.`);

    }

}
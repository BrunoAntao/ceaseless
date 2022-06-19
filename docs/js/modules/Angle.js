export class Angle {

    constructor(radians = 0) {

        if (radians instanceof Angle) {

            this.value = radians.valueOf();

        } else {

            this.value = radians;

        }

    }

    valueOf() {

        return this.value;

    }

    toDegrees() {

        return this.value * (180 / Math.PI);

    }

    setDegrees(degrees) {

        this.value = (degrees * Math.PI) / 180;

        return this.value;

    }

}
import { Angle } from './Angle.js';

export class Vec2 {

    constructor(x = 0, y = 0) {

        this.x = x;
        this.y = y;

    }

    static sum(vec1 = new Vec2(), vec2 = new Vec2()) {

        return new Vec2(vec1.x + vec2.x, vec1.y + vec2.y);

    }

    clone() {

        return new Vec2(this.x, this.y);

    }

    angleBetween(vec = new Vec2()) {

        return new Angle(Math.atan2(vec.y - this.y, vec.x - this.x));

    }

    rotate(angle = new Angle(), center = new Vec2()) {

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const oldX = this.x;
        const oldY = this.y;

        this.x = (oldX - center.x) * cos - (oldY - center.y) * sin + center.x;
        this.y = (oldX - center.x) * sin + (oldY - center.y) * cos + center.y;

    }

    rotateTo(angle = new Angle(), center = new Vec2()) {

        const currentAngle = this.angleBetween(center);

        if (angle - currentAngle != Number.EPSILON) {

            this.rotate(angle - currentAngle, center);

        }

    }

}
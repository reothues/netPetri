export class Viewbox {
    constructor(args) {
        this.points = [];
        this.bBox = args;
    }
    get width() {
        return this.right - this.left;
    }
    set width(val) {
        let delta = (val - this.width) / 2;
        this.left -= delta;
        this.right += delta;
    }
    get height() {
        return this.bottom - this.top;
    }
    set height(val) {
        let delta = (val - this.height) / 2;
        this.top -= delta;
        this.bottom += delta;
    }
    get x() {
        return this.left / 2 + this.width / 2;
    }
    set x(val) {
        let delta = (val - this.x);
        this.left += delta;
        this.right += delta;
    }
    get y() {
        return this.left / 2 + this.width / 2;
    }
    set y(val) {
        let delta = (val - this.y);
        this.top += delta;
        this.bottom += delta;
    }
    get bBox() {
        return [this.left, this.top, this.right, this.bottom];
    }
    set bBox(args) {
        [this.left, this.top, this.right, this.bottom] = args;
    }
    toString() {
        return JSON.stringify([this.left, this.top, this.right, this.bottom]);
    }
}
//# sourceMappingURL=viewbox.js.map
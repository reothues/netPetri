
export class Viewbox {
  get width() : number {
    return this.right - this.left;
  }
  set width(val: number) {
    let delta = (val - this.width) / 2;
    this.left -= delta;
    this.right += delta;
  }

  get height() : number {
    return this.bottom - this.top;
  }
  set height(val: number) {
    let delta = (val - this.height) / 2;
    this.top -= delta;
    this.bottom += delta;
  }


  get x() : number {
    return  this.left / 2 + this.width / 2;
  }
  set x(val: number) {
    let delta = (val - this.x);
    this.left += delta;
    this.right += delta;
  }

  get y() : number {
    return  this.left / 2 + this.width / 2;
  }
  set y(val: number) {
    let delta = (val - this.y);
    this.top += delta;
    this.bottom += delta;
  }

  get bBox() : Array<number>{
    return [this.left, this.top, this.right, this.bottom]
  }

  set bBox(args: Array<number>) {
    [this.left, this.top, this.right, this.bottom] = args;
  }

  points: Array<any> = [];

  left: number;
  right: number;
  top: number;
  bottom: number;
  constructor(args?: Array<number>){
    this.bBox = args;
  }
  toString () : string {
    return JSON.stringify([this.left, this.top, this.right, this.bottom]);
  }
}
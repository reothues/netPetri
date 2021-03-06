import {Connectivity} from './connect';
import {Subject} from 'rxjs/Subject';
import {Place} from './place';
export enum DNodes{
  net = 'net',
  col = "col",
  from = 'from',
  to = 'to',
  place = 'place',
  trans = 'trans',
  sition = 'sition'

}
export class Map {
  columns: Array<Array<Place>>;
  constructor (private petri: Connectivity){
  }
  analyse() {

    let columns = [];
    this.petri.walk(this.petri.startPlace);

    this.petri.depth.forEach((d, idx) => {
      // this.petri.places[idx];
      let depth = d + 1;
      columns[depth] = columns[depth] || [];
      columns[depth].push(this.petri.places[idx]);
    });
    this.columns = columns;

  }

  placeMove(p: Place, index: number, col?: number) {

    this.columns.forEach((column, icol, arrColumns) => {
      let indexPlace = column.indexOf(p);
      if (indexPlace !== -1) {
        column.splice(indexPlace, 1);
        col = col || icol;
      }
      if (col === icol) {
        column.splice(index, 0, p);
      }
    }) 
  }

  draw(width, height, left = 0, top = 0) : DElement{
    this.analyse();
    let elRoot = new DElement(DNodes.net);
    elRoot.width = width;
    elRoot.height = height;
    elRoot.center = {x: left - elRoot.left + elRoot.x
      , y: top - elRoot.top + elRoot.y};

    let arrElPlace : Array<DElement> = new Array(this.petri.places.length);
    let _colWidth = width / this.columns.length;
    this.columns.forEach((arrPlace, iCol, arr) => {
      let elCol = elRoot.createElement(DNodes.col);
      elCol.center = {x: (iCol + .5) / arr.length * elRoot.width + elRoot.left
        , y: elRoot.center.y};

      elCol.width = _colWidth;
      elCol.height = height;

      arrPlace.forEach((p, iPlac, arr) => {
        let index = this.petri.places.indexOf(p);
        let elPlace = elCol.createElement(DNodes.place);
        arrElPlace[index] = elPlace;
        elPlace.setAttribute('text', p.name);

        elPlace.center = {x: elCol.center.x
          , y: (iPlac + .5) / arr.length * elCol.height + elCol.top}


        elPlace.width = elCol.width * .5;
        elPlace.height = elCol.height / arr.length * .5;

        let elFrom = elPlace.createElement(DNodes.from);
        elFrom.center = {y: elPlace.center.y, x: elPlace.left};
        elFrom.width = elPlace.width / 10;
        elFrom.height = elPlace.height;

        let elTo = elPlace.createElement(DNodes.to);
        elTo.center = {y: elPlace.center.y, x: elPlace.right};
        elTo.width = elPlace.width / 10;
        elTo.height = elPlace.height;

        p.from.forEach((t, iTrans, arr) => {
          let elT = elFrom.createElement(DNodes.trans);
          elT.center = {x: elFrom.center.x
            , y: (iTrans + .5) / arr.length * elFrom.height + elFrom.top}
        })

        p.to.forEach((t, iTrans, arr) => {
          let elT = elTo.createElement(DNodes.trans);
          elT.center = {x: elTo.center.x
            , y: (iTrans + .5) / arr.length * elTo.height + elTo.top}
        })
      })
    });
    let elTrans : Array<DElement> = new Array(this.petri.transitions.length);
    let CURVE = _colWidth * .15;
    this.petri.transitions.forEach((t, iTrans) => {
      let pointFrom = {x: 0, y: 0}
        , pointTo = {x: 0, y: 0};
      let curveFrom : Array<Array<Point>> = new Array(t.from.length)
        , curveTo : Array<Array<Point>> = new Array(t.to.length);
      t.from.forEach((p, i, arr) => {
        let index = this.petri.places.indexOf(p);
        let elPlace = arrElPlace[index];
        let elFrom = elPlace.find('to')[0];
        let {x, y} = elFrom.find('trans')[p.to.indexOf(t)].center;
        pointFrom.x += x / arr.length;
        pointFrom.y += y / arr.length;
        curveFrom[i] = [{x: x, y: y}, {x: x + CURVE, y: y}]
      });
      t.to.forEach((p, i, arr) => {
        let index = this.petri.places.indexOf(p);
        let elPlace = arrElPlace[index];
        let elTo = elPlace.find('from')[0];
        let {x, y} = elTo.find('trans')[p.from.indexOf(t)].center;
        pointTo.x += x / arr.length;
        pointTo.y += y / arr.length;
        curveTo[i] = [{x: x - CURVE, y: y}, {x: x, y: y}];
      });
      let elTransition = elRoot.createElement(DNodes.sition);
      elTransition.left = pointFrom.x;
      elTransition.right = pointTo.x;
      elTransition.top = pointFrom.y;
      elTransition.bottom = pointTo.y;
      let rate = CURVE / Math.hypot(elTransition.width, elTransition.height);
      elTransition.width *= rate;
      elTransition.height *= rate;
      pointFrom = {x: elTransition.left, y: elTransition.top};
      pointTo = {x: elTransition.right, y: elTransition.bottom};

      elTransition.width = 10;
      elTransition.height = 10;
      elTransition.attributes.curveFrom = curveFrom;
      elTransition.attributes.curveTo = curveTo;
      elTransition.attributes.pointFrom = pointFrom;//{x: elTransition.left, y: elTransition.top};
      elTransition.attributes.pointTo =  pointTo;//{x: elTransition.right, y: elTransition.bottom};
      elTrans[iTrans] = elTransition;
    })
    return elRoot;
  }

}

export class Shape {
  
  left: number = 0;
  right: number = 0;
  top: number = 0;
  bottom: number = 0;
  
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
    return this.center.x;
  }
  get y() : number {
    return this.center.y;
  }

  get center() : Point {
    return {x: (this.right + this.left) / 2, y: (this.bottom + this.top) / 2}
  }
  set center(val: Point){
    let _center = this.center;
    let dx = _center.x - val.x,
      dy = _center.y - val.y;
    this.left -= dx;
    this.right -= dx;
    this.top -= dy;
    this.bottom -= dy;
  }
}

interface Point{
  x: number
  y: number
}

export class DElement extends Shape {
  nodeName: DNodes;
  attributes: any = {};
  childNodes: Array<DElement> = [];
  parentNode?: DElement;
  // onpaint: Subject<DElement> = Subject.create();
  paint(): void{
    // this.onpaint.next(this);
    this.childNodes.forEach(e => {
      e.paint();
    })
  }
  find(n: string) : Array<DElement> {
    return this.childNodes.filter(a => a.nodeName.toString() === n);
  }
  isPointIn(p: Point) : boolean {
    return p.x < this.right && p.x > this.left && p.y < this.bottom && p.y > this.top;
  }
  createElement(name: DNodes) : DElement {
    let ret = new DElement(name);
    ret.parentNode = this;
    this.childNodes.push(ret);
    return ret;
  }
  setAttribute(key: string, val: any){
    this.attributes[key] = val;
  }
  constructor(name: DNodes) {
    super();
    this.nodeName = name;
  }
}
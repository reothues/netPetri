import {Connectivity} from './connect';
import {Place} from './place';
export class map {
  columns: Array<Array<Place>>;
  constructor (private petri: Connectivity){
    let columns = [];
    this.petri.depth.forEach((depth, idx) => {
      // this.petri.places[idx];
      columns[depth] = columns[depth] || [];
      columns[depth].push(this.petri.places[idx]);
    });
    this.columns = columns;
  }
  draw(width, height, left = 0, top = 0) : DElement{
    let elRoot = new DElement('net');
    elRoot.width = width;
    elRoot.height = height;
    elRoot.center = {x: left - elRoot.left + elRoot.x
      , y: top - elRoot.top + elRoot.y};

    let arrElPlace : Array<DElement> = new Array(this.petri.places.length);
    let _colWidth = width / this.columns.length;
    this.columns.forEach((arrPlace, iCol, arr) => {
      let elCol = elRoot.createElement('col');
      elCol.center = {x: (iCol + .5) / arr.length * elRoot.width + elRoot.left
        , y: elRoot.center.y};

      elCol.width = _colWidth;
      elCol.height = height;

      arrPlace.forEach((p, iPlac, arr) => {
        let index = this.petri.places.indexOf(p);
        let elPlace = elCol.createElement('place');
        arrElPlace[index] = elPlace;

        elPlace.center = {x: elCol.center.x
          , y: (iPlac + .5) / arr.length * elCol.height + elCol.top}

        let elFrom = elPlace.createElement('from');
        elFrom.center = {y: elPlace.center.y, x: elPlace.left};

        let elTo = elPlace.createElement('to');
        elTo.center = {y: elPlace.center.y, x: elPlace.right};

        p.from.forEach((t, iTrans, arr) => {
          let elT = elFrom.createElement('trans');
          elT.center = {x: (iTrans + .5) / arr.length * elFrom.width + elFrom.left
            , y: elFrom.center.y}
        })

        p.to.forEach((t, iTrans, arr) => {
          let elT = elTo.createElement('trans');
          elT.center = {x: (iTrans + .5) / arr.length * elFrom.width + elFrom.left
            , y: elFrom.center.y}
        })
      })
    });

    this.petri.transitions.forEach(t => {
      let pointFrom = {x: 0, y: 0}
        , pointTo = {x: 0, y: 0};
      t.from.forEach((p, i, arr) => {
        let index = this.petri.places.indexOf(p);
        let elPlace = arrElPlace[index];
        let elFrom = elPlace.find('from')[0];
        let {x, y} = elFrom.find('trans')[p.to.indexOf(t)].center;
        pointFrom.x += x / arr.length;
        pointFrom.y += y / arr.length;
      });
      t.to.forEach((p, i, arr) => {
        let index = this.petri.places.indexOf(p);
        let elPlace = arrElPlace[index];
        let elTo = elPlace.find('to')[0];
        let {x, y} = elTo.find('trans')[p.from.indexOf(t)].center;
        pointTo.x += x / arr.length;
        pointTo.y += y / arr.length;
      });
      let elTransition = elRoot.createElement('sition');
      elTransition.left = pointFrom.x;
      elTransition.right = pointTo.x;
      elTransition.top = pointFrom.y;
      elTransition.bottom = pointTo.y;
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

  get center() : {x: number, y: number} {
    return {x: (this.right + this.left) / 2, y: (this.bottom + this.top) / 2}
  }
  set center(val: {x: number, y: number}){
    let _center = this.center;
    let dx = _center.x - val.x,
      dy = _center.y - val.y;
    this.left += dx;
    this.right += dx;
    this.top += dy;
    this.bottom += dy;
  }
}

export class DElement extends Shape {
  nodeName: string;
  attributes: any = {};
  childNodes: Array<DElement>;
  parentNode?: DElement;
  find(n: string) : Array<DElement> {
    return this.childNodes.filter(a => a.nodeName === n);
  }
  createElement(name: string) : DElement {
    let ret = new DElement(name);
    ret.parentNode = this;
    this.childNodes.push(ret);
    return ret;
  }
  setAttribute(key: string, val: any){
    this.attributes[key] = val;
  }
  constructor(name: string) {
    super();
    this.nodeName = name;
  }
}
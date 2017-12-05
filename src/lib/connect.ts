import {PetriNode, Place, Transition, Petri} from './place'

function swapArray(a: Array<any>, x: number, y: number) {
  a[x] = a.splice(y, 1, a[x])[0];
}

export class Connectivity extends Petri{
  sets: Array<Place>;

  deadEnds: Array<boolean>;
  disasociats: Array<boolean>;
  depth: Array<number>;
  constructor(p?: Place);
  constructor(p: Petri);

  constructor(p?: Place | Petri){
    if (p instanceof Petri) {
      super();
      this.places = p.places;
      this.transitions = p.transitions;
      this.startAt = p.startAt;
    } else {
      super(p);
    }

    this.reset();
    this.walk();
  }

  reset(): void {
    this.depth = new Array(this.places.length).fill(-1);
    this.sets = new Array(this.places.length);
    this.deadEnds = new Array(this.places.length).fill(true);
    this.disasociats = new Array(this.places.length).fill(true);
  }

  addPlace(p: Place) : number {
    let index = super.addPlace(p);
    this.reset();
    return index;
  }

  clone(p: Place) : Place {
    let ret = new Place(p.name + 'clone');
    p.to.forEach(t => {
      t.addTo(ret);
    })
    p.to.forEach(t => {
      t.addFrom(ret);
    })
    this.addPlace(ret);
    return ret;
  }

  swapPlace(i0: number, i1: number);
  swapPlace(p0: Place, p1: Place);
  swapPlace(a0: any, a1: any) {
    let i0, i1;
    if (a0 instanceof Place && this.places.indexOf(a0) != -1) {
      i0 = this.places.indexOf(a0);
    } else if (Number.isInteger(a0) && this.places[a0]) {
      i0 = a0;
    } else {
      return;
    }
    if (a1 instanceof Place && this.places.indexOf(a1) != -1) {
      i1 = this.places.indexOf(a1);
    } else if (Number.isInteger(a1) && this.places[a1]) {
      i1 = a1;
    } else {
      return;
    }
    swapArray(this.places, i0, i1);
    swapArray(this.depth, i0, i1);
    swapArray(this.disasociats, i0, i1);
    swapArray(this.deadEnds, i0, i1);
  }

  removePlace(p: Place) : number {

    let i = super.removePlace(p);
    this.depth.splice(i, 1);
    this.disasociats.splice(i, 1);
    this.deadEnds.splice(i, 1);

    return i;
  }
  static fromNet(net: Petri) {
    return 
  }
  static unserialize(str: string) : Connectivity {
    let petri = super.unserialize(str);
    let ret = new Connectivity(petri);
    return ret;
  }

  merge(arr: Array<Place>) : Place {

    let ret = new Place('merge');
    arr.forEach(p => {
      p.from.forEach(t => {
        t.addTo(ret);
      })
      p.to.forEach(t => {
        t.addFrom(ret);
      })
      ret.name += '/' + p.name;
      this.removePlace(p);
    })

    this.addPlace(ret);
    return ret;
  }

  walk(p?: Place, i = 0) {
    if (!p) {
      if (!this.startPlace) return;
      p = this.startPlace;
      this.disasociats.fill(true);
      this.depth.fill(-1);
    }

    if (i === 0) {
      this.sets = [];
    }
  	if (this.isLoop(p)) {
  	  return;
  	}
    let index = this.places.indexOf(p);
    this.depth[index] = i;
    this.disasociats[index] = false;
  	this.sets.push(p);
    let isDeadend = true;
  	p.to.forEach(t => {
      t.to.forEach(_p => {
  		  this.walk(_p, i + 1);
        isDeadend = false;
  	  })
  	})
    this.deadEnds[index] = isDeadend;
  }

  isLoop(p: Place) :boolean {
  	return this.sets.indexOf(p) !== -1;
  }


}
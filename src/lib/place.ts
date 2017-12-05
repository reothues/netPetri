import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {extraction, extractExp, contractExp, LoopDetection} from './serialization'


export enum VectorName{
  'Place',
  'Transition'
}

export class PetriNode {
  name: string;
  type: VectorName;
  from: Array<PetriNode> = [];
  to: Array<PetriNode> = [];
  attributes: any;
  id?: string;
  // newConnectFrom: Subject<PetriNode> = Subject.create();
  // newConnectTo: Subject<PetriNode> = Subject.create();

  constructor(name: string) {
    this.name = name;
  }
  dispose(){
    this.from.forEach(n => n.to.splice(n.to.indexOf(this)));
    this.to.forEach(n => n.from.splice(n.from.indexOf(this)));
  }

  addFrom(p: PetriNode) : boolean {
    if (p.type == this.type) {
      throw "type error:";
    }
    if (this.from.indexOf(p) != -1) {
      return false;
    } 
    this.from.push(p);
    p.to.push(this);
    // this.newConnectFrom.next(p);
    // p.newConnectTo.next(this);
  }
  removeFrom(p: number) : boolean;
  removeFrom(p: PetriNode) : boolean;
  removeFrom(pOrI: any) : boolean {
    let p: PetriNode;
    let index: number;
    if (Number.isInteger(pOrI)) {
      p = this.from[pOrI];
      index = pOrI;
    } else {
      p = pOrI;
      index = this.from.indexOf(p);
    }
    if (index == -1 || !p) {
      return false;
    } 
    this.from.splice(index, 1);
    p.removeTo(this);
  }
  removeTo(p: number) : boolean;
  removeTo(p: PetriNode) : boolean;
  removeTo(pOrI: any) : boolean {
    let p: PetriNode;
    let index: number;
    if (Number.isInteger(pOrI)) {
      p = this.to[pOrI];
      index = pOrI;
    } else {
      p = pOrI;
      index = this.from.indexOf(p);
    }
    if (index == -1 || !p) {
      return false;
    } 
    this.to.splice(index, 1);
    p.removeFrom(this);
  }
  addTo(p: PetriNode) : boolean {
    if (p.type == this.type) {
      throw "type error:";
    }
    if (this.to.indexOf(p) != -1) {
      return false;
    } 
    this.to.push(p);
    p.from.push(this);
    // this.newConnectTo.next(p);
    // p.newConnectFrom.next(this);
  }
  static unserializeVector(obj: any, root: any, expCurrent: string) : PetriNode {
    let ret;
    if (typeof(obj) === 'string') {
      return extractExp(obj, root);
    } else if (obj instanceof PetriNode) { 
      return obj;
    } else {
      // object extractor; need functionize
      if (obj.type == VectorName.Place){
        ret = new Place(obj.name);
      } else if (obj.type == VectorName.Transition) {
        ret = new Transition(obj.name);
      }
      contractExp(ret, root, expCurrent);

      obj.from.forEach((st, j, arr) => {
        arr[j] = PetriNode.unserializeVector(st, root, expCurrent + '.from[' + j + ']');
        ret.addFrom(arr[j]);
      })

      obj.to.forEach((st, j, arr) => {
        arr[j] = PetriNode.unserializeVector(st, root, expCurrent + '.to[' + j + ']');
        ret.addTo(arr[j]);
      })
      return ret;
    }
  }
}
export class Place extends PetriNode {
  type = VectorName.Place;
  from: Array<Transition>;
  to: Array<Transition>;

  // getToken: Subject<any> = Subject.create();
  // loseToken: Subject<any> = Subject.create();
  
  token?: any;
}
export class Transition extends PetriNode {
  type = VectorName.Transition;
  from: Array<Place>;
  to: Array<Place>;
  // pass: Subject<Place> = Subject.create();
}


export class Petri {
  id?: string;
  places: Array<Place> = [];
  transitions: Array<Transition> = [];
  attributes: any;
  startAt: number;
  stayAt: number;
  constructor(p?: Place) {
    // super();
    if (p instanceof Place) {
      this.addPlace(p);
    } else if (p) {
      this.addPlace(new Place('default'));
    }
  }
  get stayPlace() : Place {
    return this.places[this.stayAt];
  }
  get startPlace() : Place {
    return this.places[this.startAt];
  }
  set startPlace (p: Place) {
    if (this.addPlace) {

    }
    this.startAt = this.places.indexOf(p);
  }
  // static unserializeVectorEdges(obj: any, root: any) {

  // }

  indexOf(p: Place);
  indexOf(t: Transition);
  indexOf(a: Place | Transition) {
    if (a.type == VectorName.Place) {
      return this.places.indexOf(a);
    } else if (a.type == VectorName.Transition) {
      return this.transitions.indexOf(a);
    }
  }
  removePlace(p: Place) : number {
    let index = this.places.indexOf(p);
    if (index == -1) {
      throw "not a member";
    }
    this.places.splice(index, 1);
    p.dispose();
    return index;
  }
  addPlace(p: Place) : number {
    let ret = this.places.indexOf(p)
    if (ret !== -1) {
      //throw 'duplicate places'
    } else {
      ret = this.places.push(p) - 1;
    }
    if(isNaN(this.startAt)) {
      this.startAt = 0;
    }
    return ret;;
  }
  addTransition(t: Transition) : number {

    let ret = this.transitions.indexOf(t)
    if (ret !== -1) {
      //throw 'duplicate places'
    } else {
      ret = this.transitions.push(t) - 1;
    }
    return ret;;
  }
  add(t: Transition) : number
  add(p: Place) : number
  add(a: Place | Transition) : number{
    if (a.type == VectorName.Place)
      return this.addPlace(a);
    else if (a.type == VectorName.Transition)
      return this.addTransition(a);
    else 
      return -1;
  }
  

  
  static unserialize(str: string) : Petri {
    let obj = JSON.parse(str);
    let ret = new Petri();
    obj.places.forEach((p, i, arr) => {
      arr[i] = <Place> PetriNode.unserializeVector(p, obj, 'this.places[' + i + ']');
      ret.places[i] = arr[i];
    });
    obj.transitions.forEach((t, i) => {
      ret.transitions[i] = <Transition> PetriNode.unserializeVector(t, obj, 'this.transitions[' + i + ']');
    });

    ret.startAt = obj.startAt;
    ret.attributes = obj.attributes;

    return ret;
  }
  serialize() : string {
    let ret = {
      id: '',
      startAt: this.startAt,
      places: this.places,
      transitions: this.transitions,
      attributes: this.attributes
    }
    this.id = this.id || btoa(Math.random().toFixed(5));
    ret.id = this.id;
    let loopDetection: LoopDetection = {
      currentName: 'this',
      jobs: [],
      loopNames: []
    };
    return JSON.stringify(extraction(ret, loopDetection));

  }
}
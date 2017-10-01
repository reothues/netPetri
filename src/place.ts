import {Observable} from 'node_modules/rxjs/Observable';
import {Subject} from 'node_modules/rxjs/Subject';


class PetriNode {
  name: string;
  type: string;
  from: Array<PetriNode>;
  to: Array<PetriNode>;
  newConnectFrom: Subject<PetriNode> = new Subject();
  newConnectTo: Subject<PetriNode> = new Subject();
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
    this.newConnectFrom.next(p);
    p.newConnectTo.next(this);
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
    this.newConnectTo.next(p);
    p.newConnectFrom.next(this);
  }
}
export class Place extends PetriNode {
  type: 'Place';
  from: Array<Transition>;
  to: Array<Transition>;

  getToken: Subject<any> = new Subject();
  loseToken: Subject<any> = new Subject();
  
  token?: any;
}
export class Transition extends PetriNode {
  type: 'Transition';
  from: Array<Place>;
  to: Array<Place>;
  pass: Subject<Place> = new Subject();
}
export class Petri {
  places: Array<Place>;
  transitions: Array<Transition>;
  startAt: number;
  stayAt: number;
  constructor(p?: Place) {
    // super();
    if (p) {
      this.addPlace(p);
    } else {
      this.addPlace(new Place('default'));
    }
  }
  get stayPlace() : Place {
    return this.places[this.stayAt];
  }
  set startPlace (p: Place) {
    if (this.addPlace) {

    }
    this.startAt = this.places.indexOf(p);
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
  addPlace(p: Place) : boolean {
    if (this.places.indexOf(p) != -1) {
      //throw 'duplicate places'
      return false;
    }
    this.places.push(p);
    return true;
  }
  addTransition(t: Transition) : boolean {
    if (this.transitions.indexOf(t) != -1) {
      //throw 'duplicate transitions'
      return false;
    }
    this.transitions.push(t);
    return true;
  }
  add(t: Transition) : boolean
  add(p: Place) : boolean
  add(a: any) : boolean{
    if (a.type == 'Place')
      return this.addPlace(a);
    else if (a.type == 'Transition')
      return this.addTransition(a);
    else 
      return false;
  }
}
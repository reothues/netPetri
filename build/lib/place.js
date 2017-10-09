import { Subject } from 'node_modules/rxjs/Subject';
class PetriNode {
    constructor(name) {
        this.newConnectFrom = new Subject();
        this.newConnectTo = new Subject();
        this.name = name;
    }
    dispose() {
        this.from.forEach(n => n.to.splice(n.to.indexOf(this)));
        this.to.forEach(n => n.from.splice(n.from.indexOf(this)));
    }
    addFrom(p) {
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
    addTo(p) {
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
    constructor() {
        super(...arguments);
        this.getToken = new Subject();
        this.loseToken = new Subject();
    }
}
export class Transition extends PetriNode {
    constructor() {
        super(...arguments);
        this.pass = new Subject();
    }
}
export class Petri {
    constructor(p) {
        // super();
        if (p) {
            this.addPlace(p);
        }
        else {
            this.addPlace(new Place('default'));
        }
    }
    get stayPlace() {
        return this.places[this.stayAt];
    }
    set startPlace(p) {
        if (this.addPlace) {
        }
        this.startAt = this.places.indexOf(p);
    }
    removePlace(p) {
        let index = this.places.indexOf(p);
        if (index == -1) {
            throw "not a member";
        }
        this.places.splice(index, 1);
        p.dispose();
        return index;
    }
    addPlace(p) {
        if (this.places.indexOf(p) != -1) {
            //throw 'duplicate places'
            return false;
        }
        this.places.push(p);
        return true;
    }
    addTransition(t) {
        if (this.transitions.indexOf(t) != -1) {
            //throw 'duplicate transitions'
            return false;
        }
        this.transitions.push(t);
        return true;
    }
    add(a) {
        if (a.type == 'Place')
            return this.addPlace(a);
        else if (a.type == 'Transition')
            return this.addTransition(a);
        else
            return false;
    }
}

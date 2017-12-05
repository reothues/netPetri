import { extraction, extractExp, contractExp } from './serialization';
export var VectorName;
(function (VectorName) {
    VectorName[VectorName["Place"] = 0] = "Place";
    VectorName[VectorName["Transition"] = 1] = "Transition";
})(VectorName || (VectorName = {}));
export class PetriNode {
    // newConnectFrom: Subject<PetriNode> = Subject.create();
    // newConnectTo: Subject<PetriNode> = Subject.create();
    constructor(name) {
        this.from = [];
        this.to = [];
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
        // this.newConnectFrom.next(p);
        // p.newConnectTo.next(this);
    }
    removeFrom(pOrI) {
        let p;
        let index;
        if (Number.isInteger(pOrI)) {
            p = this.from[pOrI];
            index = pOrI;
        }
        else {
            p = pOrI;
            index = this.from.indexOf(p);
        }
        if (index == -1 || !p) {
            return false;
        }
        this.from.splice(index, 1);
        p.removeTo(this);
    }
    removeTo(pOrI) {
        let p;
        let index;
        if (Number.isInteger(pOrI)) {
            p = this.to[pOrI];
            index = pOrI;
        }
        else {
            p = pOrI;
            index = this.from.indexOf(p);
        }
        if (index == -1 || !p) {
            return false;
        }
        this.to.splice(index, 1);
        p.removeFrom(this);
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
        // this.newConnectTo.next(p);
        // p.newConnectFrom.next(this);
    }
    static unserializeVector(obj, root, expCurrent) {
        let ret;
        if (typeof (obj) === 'string') {
            return extractExp(obj, root);
        }
        else if (obj instanceof PetriNode) {
            return obj;
        }
        else {
            // object extractor; need functionize
            if (obj.type == VectorName.Place) {
                ret = new Place(obj.name);
            }
            else if (obj.type == VectorName.Transition) {
                ret = new Transition(obj.name);
            }
            contractExp(ret, root, expCurrent);
            obj.from.forEach((st, j, arr) => {
                arr[j] = PetriNode.unserializeVector(st, root, expCurrent + '.from[' + j + ']');
                ret.addFrom(arr[j]);
            });
            obj.to.forEach((st, j, arr) => {
                arr[j] = PetriNode.unserializeVector(st, root, expCurrent + '.to[' + j + ']');
                ret.addTo(arr[j]);
            });
            return ret;
        }
    }
}
export class Place extends PetriNode {
    constructor() {
        super(...arguments);
        this.type = VectorName.Place;
    }
}
export class Transition extends PetriNode {
    constructor() {
        super(...arguments);
        this.type = VectorName.Transition;
        // pass: Subject<Place> = Subject.create();
    }
}
export class Petri {
    constructor(p) {
        this.places = [];
        this.transitions = [];
        // super();
        if (p instanceof Place) {
            this.addPlace(p);
        }
        else if (p) {
            this.addPlace(new Place('default'));
        }
    }
    get stayPlace() {
        return this.places[this.stayAt];
    }
    get startPlace() {
        return this.places[this.startAt];
    }
    set startPlace(p) {
        if (this.addPlace) {
        }
        this.startAt = this.places.indexOf(p);
    }
    indexOf(a) {
        if (a.type == VectorName.Place) {
            return this.places.indexOf(a);
        }
        else if (a.type == VectorName.Transition) {
            return this.transitions.indexOf(a);
        }
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
        let ret = this.places.indexOf(p);
        if (ret !== -1) {
            //throw 'duplicate places'
        }
        else {
            ret = this.places.push(p) - 1;
        }
        if (isNaN(this.startAt)) {
            this.startAt = 0;
        }
        return ret;
        ;
    }
    addTransition(t) {
        let ret = this.transitions.indexOf(t);
        if (ret !== -1) {
            //throw 'duplicate places'
        }
        else {
            ret = this.transitions.push(t) - 1;
        }
        return ret;
        ;
    }
    add(a) {
        if (a.type == VectorName.Place)
            return this.addPlace(a);
        else if (a.type == VectorName.Transition)
            return this.addTransition(a);
        else
            return -1;
    }
    static unserialize(str) {
        let obj = JSON.parse(str);
        let ret = new Petri();
        obj.places.forEach((p, i, arr) => {
            arr[i] = PetriNode.unserializeVector(p, obj, 'this.places[' + i + ']');
            ret.places[i] = arr[i];
        });
        obj.transitions.forEach((t, i) => {
            ret.transitions[i] = PetriNode.unserializeVector(t, obj, 'this.transitions[' + i + ']');
        });
        ret.startAt = obj.startAt;
        ret.attributes = obj.attributes;
        return ret;
    }
    serialize() {
        let ret = {
            id: '',
            startAt: this.startAt,
            places: this.places,
            transitions: this.transitions,
            attributes: this.attributes
        };
        this.id = this.id || btoa(Math.random().toFixed(5));
        ret.id = this.id;
        let loopDetection = {
            currentName: 'this',
            jobs: [],
            loopNames: []
        };
        return JSON.stringify(extraction(ret, loopDetection));
    }
}
//# sourceMappingURL=place.js.map
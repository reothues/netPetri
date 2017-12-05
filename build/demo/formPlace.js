import { Place } from '../lib/place';
import { net } from './singletons';
import { createSelect, createDOM, bindSeletorWithNew } from './util';
import { createFormTrans } from './formTrans';
export class FormOfPlace {
    set pEditing(val) {
        this.p = val;
    }
    ;
    get pEditing() {
        return this.p;
    }
    ;
    constructor(rerender) {
        this.formLocation = document.getElementById('createLocation');
        this.formLocation.onsubmit = function (event) {
            event.preventDefault();
            rerender();
            return false;
        };
        this.formLocation.setAttribute('action', '#');
        this.createSeletorPlaces();
        let btnN = createDOM('button', '+');
        btnN.addEventListener('click', this.evtNewPlace);
        this.formLocation.appendChild(btnN);
        net.places.forEach(p => {
            let formDetail = new FormDetailOfPlace(p);
            formDetail.appendTo(this.formLocation);
            this.createSwapButton(formDetail.formLocation, p);
        });
    }
    evtNewPlace(event) {
        let name;
        if (name = prompt('name', 'new place')) {
            let p = new Place(name);
            net.addPlace(p);
        }
    }
    createSeletorPlaces() {
        let selPlaces = document.createElement('select');
        let self = this;
        bindSeletorWithNew(selPlaces, (val) => {
            this.selectPlace(val);
        });
        this.formLocation.appendChild(selPlaces);
        createSelect(net.places, selPlaces);
    }
    createSwapButton(formDetail, place) {
        let btn = createDOM('button', '↓');
        var self = this;
        btn.addEventListener('click', function () {
            let i = net.places.indexOf(place);
            net.swapPlace(i, i + 1);
        });
        formDetail.appendChild(btn);
    }
    selectPlace(value) {
        if (value == '-2') {
            this.pEditing = undefined;
        }
        else if (value == '-1') {
            return this.evtNewPlace(event);
        }
        else {
            this.pEditing = net.places[value];
        }
    }
}
class FormDetailOfPlace {
    constructor(pEditing) {
        this.pEditing = pEditing;
        this.select = {
            from: null, to: null
        };
        this.formLocation = createDOM('div', '');
        this.formLocation.appendChild(createDOM('h2', 'place details'));
        this.formTrans = new createFormTrans(pEditing);
        this.createTransitionFrom();
        this.createMainTitle();
        this.createTransitionTo();
        this.fillTransitionsList();
    }
    selectTransition(value, fromOrTo) {
        if (value == '-2') {
            return;
        }
        else if (value == '-1') {
            return this.formTrans.show(fromOrTo == 'from');
        }
        else {
            this.tEditing = this.pEditing[fromOrTo][value];
            // if (fromOrTo) {
            //   this.pEditing.addFrom(this.tEditing);
            // } else {
            //   this.pEditing.addTo(this.tEditing);
            // }
        }
    }
    createTransition(fromOrTo) {
        this.formLocation.appendChild(createDOM('span', fromOrTo));
        let selTrans = document.createElement('select');
        let self = this;
        bindSeletorWithNew(selTrans, (val) => {
            this.selectTransition(val, fromOrTo);
        });
        this.formLocation.appendChild(selTrans);
        let btn = createDOM('button', '-');
        this.formLocation.appendChild(btn);
        let pEditing = this.pEditing;
        btn.addEventListener('click', function (event) {
            let idx = Number(selTrans.value);
            if (idx < 0) {
                return;
            }
            pEditing['remove' + fromOrTo](idx);
        });
        this.select[fromOrTo] = selTrans;
    }
    createTransitionFrom() {
        this.createTransition('from');
    }
    createMainTitle() {
        let inName = createDOM('input', this.pEditing.name);
        inName.value = this.pEditing.name;
        var self = this;
        inName.addEventListener('input', function (event) {
            self.pEditing.name = this.value;
        });
        this.formLocation.appendChild(inName);
    }
    createTransitionTo() {
        this.createTransition('to');
    }
    fillTransitionsList() {
        let p = this.pEditing;
        if (!p) {
            createSelect([], this.select.from);
            createSelect([], this.select.to);
        }
        else {
            createSelect(p.from, this.select.from);
            createSelect(p.to, this.select.to);
        }
    }
    appendTo(el) {
        el.appendChild(this.formLocation);
    }
}
//# sourceMappingURL=formPlace.js.map
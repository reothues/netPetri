import { DNodes, Map, DElement } from '../lib/draw';
import { Connectivity } from '../lib/connect';
import { Place, Transition, PetriNode } from '../lib/place';
import { net } from './singletons'
import { createSelect, createDOM, bindSeletorWithNew } from './util';
import { createFormTrans } from './formTrans'

export class FormOfPlace {
  private p: Place;
  set pEditing (val : Place) {
    this.p = val;

  };
  get pEditing () : Place {
    return this.p
  };
  tEditing: PetriNode;
  formLocation: HTMLFormElement;

  constructor(rerender: Function) {
    this.formLocation = <HTMLFormElement>document.getElementById('createLocation');
    this.formLocation.onsubmit = function (event) {
      event.preventDefault();
      rerender();
      return false;
    }

    this.formLocation.setAttribute('action', '#');

    this.createSeletorPlaces();


    let btnN = createDOM('button', '+');
    btnN.addEventListener('click', this.evtNewPlace);
    this.formLocation.appendChild(btnN);

    net.places.forEach(p => {
      let formDetail = new FormDetailOfPlace(p);
      formDetail.appendTo(this.formLocation);
      this.createSwapButton(formDetail.formLocation, p);

    })
  }


  evtNewPlace (event) {
    let name;
    if (name = prompt('name', 'new place')) { 
      let p  = new Place(name);
      net.addPlace(p);
    }
  }


  createSeletorPlaces () {

    let selPlaces = document.createElement('select');
    let self = this;
    bindSeletorWithNew(selPlaces, (val) => {
      this.selectPlace(val)
    });
    this.formLocation.appendChild(selPlaces);

    createSelect(net.places, selPlaces);
  }

  createSwapButton(formDetail: HTMLElement, place: Place) {
    let btn = createDOM('button', '↓');
    var self = this;
    btn.addEventListener('click', function () {
      let i = net.places.indexOf(place);
      net.swapPlace(i, i + 1);
    })
    formDetail.appendChild(btn)
  }

  selectPlace(value) {
    if (value == '-2') {
      this.pEditing = undefined;
    } else if (value == '-1') {
      return this.evtNewPlace(event);
    } else {
      this.pEditing =  net.places[value];
    }
  }
}

class FormDetailOfPlace {

  formLocation: HTMLElement;
  tEditing: PetriNode;
  select: {
    from: HTMLSelectElement,
    to: HTMLSelectElement
  } = {
    from: null, to: null
  }
  formTrans;
  rerender;
  constructor(public pEditing: Place) {
    this.formLocation = createDOM('div', '');
    this.formLocation.appendChild(createDOM('h2', 'place details'));
    this.formTrans = new createFormTrans(pEditing);

    this.createTransitionFrom();

    this.createMainTitle();

    this.createTransitionTo();

    this.fillTransitionsList();
  }

  selectTransition (value, fromOrTo) {
    if (value == '-2') {
      return;
    } else if (value == '-1') {
      return this.formTrans.show(fromOrTo == 'from')
    } else {
      this.tEditing = this.pEditing[fromOrTo][value];
      // if (fromOrTo) {
      //   this.pEditing.addFrom(this.tEditing);
      // } else {
      //   this.pEditing.addTo(this.tEditing);
      // }
    }
  }

  private createTransition(fromOrTo) {

    this.formLocation.appendChild(createDOM('span', fromOrTo));

    let selTrans = document.createElement('select');
    let self = this;

    bindSeletorWithNew(selTrans, (val) => {
      this.selectTransition(val, fromOrTo);
    });

    this.formLocation.appendChild(selTrans);
    
    let btn = createDOM('button', '-');
    this.formLocation.appendChild(btn);
    let pEditing = this.pEditing
    btn.addEventListener('click', function(event) {
      let idx = Number(selTrans.value);
      if (idx < 0) {
        return
      }
      pEditing['remove' + fromOrTo](idx);
    });
    this.select[fromOrTo] = selTrans;
  }

  createTransitionFrom () {
    this.createTransition('from');
  }

  createMainTitle() {
    let inName = <HTMLInputElement> createDOM('input', this.pEditing.name);
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
    let p  = this.pEditing;
    if (!p) {
      createSelect([], this.select.from);
      createSelect([], this.select.to);
    } else {
      createSelect(p.from, this.select.from);
      createSelect(p.to, this.select.to);
    }
  }


  appendTo(el: HTMLElement) {
    el.appendChild(this.formLocation);
  }
}

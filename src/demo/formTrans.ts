import { DNodes, Map, DElement } from '../lib/draw';
import { Connectivity } from '../lib/connect';
import { Place, Transition } from '../lib/place';
import { map, net} from './singletons';
import { createSelect, bindSeletorWithNew } from './util';

export class createFormTrans{
  formTransition: HTMLFormElement;
  constructor (public pEditing: Place) {
    let formTransition = document.createElement('form');
    formTransition.style.left = '0';
    formTransition.style.top = '0';
    formTransition.style.bottom = '0';
    formTransition.style.right = '0';
    formTransition.style.position = 'absolute';
    formTransition.style.display = 'none';
    formTransition.style.background = 'rgba(255, 255, 255, .75)';
    formTransition.style.padding = '20%';
    formTransition.setAttribute('action', '#');
    this.formTransition = formTransition;
    document.body.appendChild(formTransition);

    let elTitle = document.createElement('h1');
    elTitle.textContent = 'add Transitions to Place';
    formTransition.appendChild(elTitle);

    let selTrans = document.createElement('select');
    let btnTrans = document.createElement('button');
    let spanF = document.createElement('h2');
    let spanT = document.createElement('h2');

    spanF.textContent = "available Transitions:"
    spanT.textContent = "or create your new Transition:"
    btnTrans.textContent = 'create';

    formTransition.appendChild(spanF);
    formTransition.appendChild(selTrans);
    formTransition.appendChild(spanT);
    formTransition.appendChild(btnTrans);


    bindSeletorWithNew(selTrans, (val) => {
      if (val == '-2') {
        return 
      } else if (val == '-1') {
        this.evtNewTrans(event);
      } else if (this.isFrom) {
        this.pEditing.addFrom(net.transitions[val]);
      } else {
        this.pEditing.addTo(net.transitions[val]);
      }
      formTransition.style.display = 'none';
    })
    selTrans.addEventListener('input', function (event) {
      
    })

    btnTrans.addEventListener('click', this.evtNewTrans);
    this.selTrans = selTrans;
  }
  isFrom = false;
  selTrans;

  evtNewTrans (event) {
    let name = prompt('new transition', 'new transition');
    if (name) {
      let trans = new Transition(name);
      if (this.isFrom) {
        this.pEditing.addFrom(trans);
      } else {
        this.pEditing.addTo(trans);
      }
      net.addTransition(trans);
      this.formTransition.style.display = 'none';
    }
  }

  show (isFrom) {
    createSelect(net.transitions, this.selTrans, null);
    this.formTransition.style.display = 'block';
  }
}
import { DNodes, Map, DElement } from '../lib/draw';
import { Connectivity } from '../lib/connect';
import { Place, Transition, PetriNode } from '../lib/place';
import { net } from './singletons'
import { createSelect, createDOM } from './util';
import { createFormTrans } from './formTrans'
export class PlaceController {
  
  addPlace() : Place | boolean  {
    let name;
    if (name = prompt('name', 'new place')) { 
      let p  = new Place(name);
      net.addPlace(p);
      return p;
    }
    return false;
  }

  swapPlace(p: Place) {
    let i = net.indexOf(p);
    net.swapPlace(i, i + 1);
  }
}
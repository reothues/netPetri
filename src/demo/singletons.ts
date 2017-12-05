import { DNodes, Map, DElement } from '../lib/draw';
import { Connectivity } from '../lib/connect';
import { Place, Transition } from '../lib/place';

function init() {
  let net : Connectivity;
  if (window.localStorage.getItem('cache')) {
    net = Connectivity.unserialize(window.localStorage.getItem('cache'));
  } else {
    net = new Connectivity();

    let start = new Transition('start point');
    net.addTransition(start);
    net.startPlace.addFrom(start);
  }
  return net;
}
export let net = init();
export let map = new Map(net);
export let pEditing: Place = net.places[0];
export let tEditing;


import { DNodes, Map, DElement } from '../lib/draw';
import { Connectivity } from '../lib/connect';
import { Place, Transition } from '../lib/place';
import { map, net, pEditing, tEditing } from './singletons';
import { FormOfPlace } from './formPlace'
import { render } from './render'
export default map;

let fromPlace = new FormOfPlace(renderResult);
function renderResult() {
  render();
}
renderResult();
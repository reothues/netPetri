import { PetriNode } from '../lib/place';

export function createSelect(arr: Array<PetriNode>, elSelect: HTMLSelectElement, selectedDatum: PetriNode = arr[0]) {
  while(elSelect.childNodes[0]){
    elSelect.removeChild(elSelect.childNodes[0]);
  }

  let el = document.createElement('option');
  el.value = '-1';
  el.textContent = '- add new -'
  elSelect.appendChild(el);

  if (0 === arr.length) {

  }

  arr.forEach((p, i) => {
    el = document.createElement('option');
    el.textContent = [(p.from.map((v, i) => v.name.charAt(0))).join('/') , p.name, (p.to.map((v, i) => v.name.charAt(0))).join('/')].join('=');
    el.value = i.toFixed(0);
    if (p == selectedDatum) {
    // if (pEditing == net.places[i]) {
        el.selected = true;
    } 
    elSelect.appendChild(el);
  })

}

export function bindSeletorWithNew(sel: HTMLSelectElement ,fn: Function) {
  sel.addEventListener('input', function(event) {
    fn(this.value);
  });
  sel.addEventListener('click', function() {
    if (this.options.length == 1 && this.value == '-1') {
      if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("input", false, true);
        this.dispatchEvent(evt);
      } else {
        this.fireEvent("onchange");
      }
    }
  });
}

export function createDOM(name, text, profiles = {}) {
  let ret = <HTMLElement> document.createElement(name);
  if (typeof text != 'string') {
    profiles = text || profiles;
  } else {
    ret.textContent = text;
  }
  for (let key in profiles) {
    ret.setAttribute(key, profiles[key]);
  }
  return ret;
}
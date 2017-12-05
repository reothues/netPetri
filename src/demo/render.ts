import { DNodes, Map, DElement } from '../lib/draw';
import { map, net, pEditing, tEditing } from './singletons';

function createCanvas(width = 1900, height = 600) : CanvasRenderingContext2D {
  let canvs = <HTMLCanvasElement>document.getElementById('post');
  let post = canvs.getContext('2d');

  canvs.width = width;
  canvs.height = height;
  canvs.style.width = width.toFixed(0) + 'px';
  canvs.style.height = height.toFixed(0) + 'px';

  canvs.addEventListener('click', function (argument) {
    render();
  });
  return post
}
export let post = createCanvas();

export function render(){
  post.clearRect(0, 0, post.canvas.width, post.canvas.height);
  let el = map.draw(post.canvas.width, post.canvas.height);
  _renderRecurr(el);

  window.localStorage.setItem('cache', net.serialize());
}
function _renderRecurr(el: DElement) {
  post.save();
  post.strokeStyle = getColor(el.nodeName);

  switch (el.nodeName) {
    case  DNodes.sition:
      return _renderCurve(el);
    case DNodes.place: 
      let elContent = document.createElement('div');
      elContent.innerHTML = el.attributes.html;
      elContent.contentEditable = 'true';
      elContent.style.position = 'absolute';
      elContent.style.left = el.left + 'px';
      elContent.style.top = el.top + 'px';
      elContent.style.width = el.width + 'px';
      elContent.style.height = el.height + 'px';
    default:
      post.beginPath();
      post.strokeRect(el.left, el.top, el.width, el.height);
      post.strokeText(el.nodeName.toString(), el.x, el.top + 100);
      post.strokeText(el.attributes.text, el.x, el.y);
      post.restore();
      break;
  } 
  el.childNodes.forEach(e => {
    _renderRecurr(e);
  })
}
function _renderCurve(el){
  post.save();
  el.attributes.curveFrom.forEach(p => {
    post.moveTo(p[0].x, p[0].y);
    post.bezierCurveTo(p[1].x, p[1].y
      , el.attributes.pointFrom.x, el.attributes.pointFrom.y
      , el.center.x, el.center.y);
    post.stroke();
  })

  el.attributes.curveTo.forEach(p => {
    post.moveTo(el.center.x, el.center.y);
    post.bezierCurveTo(el.attributes.pointTo.x, el.attributes.pointTo.y
      , p[0].x, p[0].y
      , p[1].x, p[1].y);
    post.stroke();
  })
  post.restore();
}
function getColor(type: DNodes) {
  switch (type) {
    case DNodes.col:
      return 'white';
    case DNodes.place:
      return 'blue';
    case DNodes.from:
      return 'white';
    case DNodes.to:
      return 'white';
    case DNodes.trans:
      return 'red';
    case DNodes.sition:
      return 'black';
  }
}


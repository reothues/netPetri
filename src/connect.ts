import {Place, Transition, Petri} from './place'

export class Connectivity extends Petri{
  sets: Array<Place>;

  deadEnds: Array<boolean>;
  disasociats: Array<boolean>;
  depth: Array<number>;
  constructor(){
    super();
    this.walk(this.startPlace);
  	this.places.forEach((p, i) => {
      if(this.sets.indexOf(p) == -1){
        this.disasociats[i] == true;
      }
  	});
  }

  clone(p: Place) : Place {
    let ret = new Place(p.name + 'clone');
    p.to.forEach(t => {
      t.addTo(ret);
    })
    p.to.forEach(t => {
      t.addFrom(ret);
    })
    this.addPlace(ret);
    return ret;
  }

  removePlace(p: Place) : number {

    let i = super.removePlace(p);
    this.depth.splice(i, 1);
    this.disasociats.splice(i, 1);
    this.deadEnds.splice(i, 1);

    return i;
  }

  merge(arr: Array<Place>) : Place {

    let ret = new Place('merge');
    arr.forEach(p => {
      p.from.forEach(t => {
        t.addTo(ret);
      })
      p.to.forEach(t => {
        t.addFrom(ret);
      })
      ret.name += '/' + p.name;
      this.removePlace(p);
    })

    this.addPlace(ret);
    return ret;
  }

  walk(p: Place, i = 0) {
  	if (this.isLoop(p)) {
  	  return;
  	}
    let index = this.places.indexOf(p);
    this.depth[index] = i;
  	this.sets.push(p);
    let isDeadend = true;
  	p.to.forEach(t => {
      t.to.forEach(_p => {
  		  this.walk(_p, i + 1);
        isDeadend = false;
  	  })
  	})
    this.deadEnds[index] = isDeadend;
  }

  isLoop(p: Place) :boolean {
  	return this.sets.indexOf(p) !== -1;
  }

}
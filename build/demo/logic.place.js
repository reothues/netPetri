import { Place } from '../lib/place';
import { net } from './singletons';
export class PlaceController {
    addPlace() {
        let name;
        if (name = prompt('name', 'new place')) {
            let p = new Place(name);
            net.addPlace(p);
            return p;
        }
        return false;
    }
    swapPlace(p) {
        let i = net.indexOf(p);
        net.swapPlace(i, i + 1);
    }
}
//# sourceMappingURL=logic.place.js.map
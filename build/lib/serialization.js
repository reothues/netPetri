export class LoopDetection {
    constructor() {
        this.currentName = 'this';
        this.jobs = [];
        this.loopNames = [];
    }
}
export function extractExp(exp, context) {
    return function () { return eval(exp); }.call(context);
}
export function contractExp(injection, context, exp) {
    return function (injection) { return eval(exp + '=injection'); }.call(context, injection);
}
export function extraction(obj, loopDetection) {
    let ret = Array.isArray(obj) ? [] : {};
    let { currentName } = loopDetection;
    for (let key in obj) {
        let item = obj[key];
        switch (typeof (item)) {
            case "undefined":
                break;
            case "object":
                loopDetection.currentName = Array.isArray(obj) ? currentName + '[' + key + ']' : currentName + '.' + key;
                let ifLoop = loopDetection.jobs.indexOf(item);
                if (ifLoop === -1) {
                    loopDetection.jobs.push(item);
                    loopDetection.loopNames.push(loopDetection.currentName);
                    ret[key] = extraction(obj[key], loopDetection); // 深度优先
                    // ret[key] = '$' + (loopDetection.loopNames.length - 1); // 广度优先 return first loop extraction later
                }
                else {
                    ret[key] = loopDetection.loopNames[ifLoop];
                }
                break;
            default:
                ret[key] = obj[key].toString();
                break;
        }
    }
    loopDetection.currentName = currentName;
    return ret;
}
export class Serializer {
    constructor(root) {
        this.root = root;
    }
    serialize() {
        this.loopDetector = new LoopDetection;
        return JSON.stringify(extraction(this.root, this.loopDetector));
    }
    unserialize(value, expr = 'this') {
        if (typeof value == 'string') {
            return extractExp(value, this.root);
        }
        else {
            contractExp(value, this.root, expr);
            for (let key in value) {
                let _expr = expr + '[' + key + ']';
                this.unserialize(value[key], _expr);
            }
            return value;
        }
    }
}
//# sourceMappingURL=serialization.js.map
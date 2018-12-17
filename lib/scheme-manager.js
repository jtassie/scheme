'use strict';

let fs = require('fs');
let schemeModel = require('./scheme-model');

let _schemeIndex = new WeakMap();
let _schemeModelIndex = new WeakMap();

class SchemeManager {

    constructor(path){

        let me = this;
        _schemeIndex.set(this, {});
        _schemeModelIndex.set(this, {});

        let files = fs.readdirSync(path);
        files.forEach(function(item) {
            if (item.endsWith(".json")) {
                let model = require(path + '/' + item);

                if (model.properties && model.properties.type && model.properties.type.enum
                    && model.properties.type.enum[0]) {

                    let currentIndex = _schemeIndex.get(me);
                    let currentKey = model.properties.type.enum[0];
                    currentIndex[currentKey] = model;

                    let currentModelIndex = _schemeModelIndex.get(me);
                    currentModelIndex[currentKey] = new schemeModel(model);

                } else {
                    console.warn('skipping file \'' + item + '\' with missing \'type\' property');
                }
            }
        });

        let keyCount = Object.keys(_schemeIndex.get(me)).length;
        let schemes = Object.keys(_schemeIndex.get(me)).join(', ');
        console.info('Indexed ' + keyCount + ' schemes: ' + schemes);
    }
    getScheme(type){
        let map = _schemeIndex.get(this);
        return map[type];
    }
    hasScheme(type){
        let scheme = this.getScheme(type);
        return scheme != undefined;
    }
    getSchemes(){
        let contracts = [];
        let map = _schemeIndex.get(this);
        Object.keys(map).forEach(function(key) {

            contracts.push(map[key]);
        });
        return contracts;
    }
    getModel(type){
        let map = _schemeModelIndex.get(this);
        return map[type];
    }
}

module.exports = SchemeManager;
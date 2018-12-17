'use strict';

/**
 * This module is the entry point into the library. Point it at a directory holding scheme files and it will index
 * the directories contents by building instances of SchemeModel (parsed representations of the scheme files).
 *
 * After the directory is indexed, you can retrieve each model by the 'type' property, as well as get the instances
 * of the SchemeModels themselves for using for validation and object creation.
 */

let fs = require('fs');
let schemeModel = require('./scheme-model');

//a hashmap of the scheme files, indexed by 'type' property:
let _schemeIndex = new WeakMap();
//a hashmap of the parsed models available after indexing is complete.
let _schemeModelIndex = new WeakMap();

class SchemeManager {

    constructor(path){

        let me = this;
        _schemeIndex.set(this, {});
        _schemeModelIndex.set(this, {});

        //read the directory and iterate over each scheme file found:
        let files = fs.readdirSync(path);
        files.forEach(function(item) {
            if (item.endsWith(".json")) {
                let model = require(path + '/' + item);

                //check that file looks like a real scheme file:
                if (model.properties && model.properties.type && model.properties.type.enum
                    && model.properties.type.enum[0]) {

                    //extract the key ('type'), and index the scheme file:
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

        //print some basic stats about contents of directory:
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
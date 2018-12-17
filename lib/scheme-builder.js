'use strict';

/**
 * This module provides a builder pattern from a parsed map model (SchemeModel). This builder pattern is the entry point
 * for 2 tasks: object validation, and new object creation.
 *
 * The resultant builder object will have fluent 'withX' methods for every property, as well as sub builders for any
 * sub-structures.
 */

// helper used to normalize builder function names:
const camelCase = require('camelcase');
let utils = require('./scheme-utils');

//holds the definition of our scheme model
let _model = new WeakMap();

//a hashmap that holds the actual values for the model, indexed by property key.
let _modelPropertyValueMap = new WeakMap();

class SchemeBuilder {

    constructor(model){

        let me = this;
        _model.set(this, model);
        _modelPropertyValueMap.set(this, {});

        //foreach key in the model, dynamically create a builder function
        Object.keys(model).forEach(function(val){

            let property = model[val];

            //check for special hard coded properties. these don't need builder methods:
            if (property.hasOwnProperty('constant')){

                _modelPropertyValueMap.get(me)[val] = property.constant;
            } else {
                //add setters for each property:
                me[camelCase('with_'+val)] = function(prop){

                    _modelPropertyValueMap.get(me)[val] = prop;
                    return me;
                };
            }

            //if its a nested structure, create a builder for that too:
            if (property.hasOwnProperty('isNested')){
                Object.defineProperty(me, camelCase('builder_' + val), {
                    get: function(){
                        return new SchemeBuilder(property);
                    }
                });
            }
        });
    }
    validate(validationCb){
        return this.validateModel(this, validationCb);
    }
    validateModel(model, validationCb) {

        let validationResult = utils.validateModelFn(_model.get(this), model);
        if (Object.keys(validationResult).length > 0 && validationCb){
            validationCb(validationResult);
        }
        return validationResult;
    }
    build(validationCb){

        //build a plain old json model out of everything:
        let model = {};
        let me = this;
        //loop over all the values we have in the hashmap, and add to the plain old json model:
        Object.keys(_modelPropertyValueMap.get(this)).forEach(function(key){
            model[key] = _modelPropertyValueMap.get(me)[key];
        });
        this.validateModel(model, validationCb);
        return model;
    }
}

module.exports = SchemeBuilder;
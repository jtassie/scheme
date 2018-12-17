'use strict';

const camelCase = require('camelcase');
let utils = require('./scheme-utils');

//holds the definition of our scheme model
let _model = new WeakMap();

//holds the actual values for the model, indexed by property key
let _modelPropertyValueMap = new WeakMap();

class SchemeBuilder {

    constructor(model){

        let me = this;
        _model.set(this, model);
        _modelPropertyValueMap.set(this, {});

        Object.keys(model).forEach(function(val){

            let property = model[val];

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

        let model = {};
        let me = this;
        Object.keys(_modelPropertyValueMap.get(this)).forEach(function(key){
            model[key] = _modelPropertyValueMap.get(me)[key];
        });
        this.validateModel(model, validationCb);
        return model;
    }
}

module.exports = SchemeBuilder;
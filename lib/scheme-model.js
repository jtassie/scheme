'use strict';

let types = require('./scheme-types');
let builder = require('./scheme-builder');

let _modelDefinition = new WeakMap();
let _propertyMap = new WeakMap();

let scanDefinition = function(definition){

    let propertyMap = {};
    if (definition.properties){
        Object.keys(definition.properties).forEach(function(val){

            let requiredFields = definition.required;
            let propertyDefinition = definition.properties[val];
            let type = propertyDefinition.type;

            if (type === 'object'){
                propertyMap[val] = scanDefinition(propertyDefinition);
                propertyMap[val].isNested = true;
            } else {
                let isEnum = (propertyDefinition.hasOwnProperty('enum'));
                let isRequired = requiredFields.includes(val);

                let schemeProperty = {
                    required: isRequired
                };

                if (isEnum){
                    schemeProperty.validator = function(val){
                        return propertyDefinition.enum.includes(val);
                    };
                    if (propertyDefinition.enum.length == 1){
                        schemeProperty.constant = propertyDefinition.enum[0];
                    }
                } else {
                    let foundType = types[type];
                    if (!foundType){
                        console.debug('could not resolve type: ' + type);
                    } else {
                        schemeProperty.type = foundType;
                    }
                }

                propertyMap[val] = schemeProperty;
            }
        });
    } else {
        console.debug('No properties found');
    }

    return propertyMap;
}

class SchemeModel {
    constructor(definition){

        _modelDefinition.set(this, definition);
        _propertyMap.set(this,scanDefinition(definition));
    }
    get builder(){
        return new builder(_propertyMap.get(this));
    }
    get propertyModel(){
        return _propertyMap.get(this);
    }
}

module.exports = SchemeModel;
'use strict';

/**
 * This module provides a parsed representation of the Scheme. It parses out an enumeration of all the properties in
 * the scheme (and properties about them). It also attempts to map the property to a known data-type. Finally, it exposes
 * a builder pattern for object creation of the parsed model.
 *
 */

let types = require('./scheme-types');
let builder = require('./scheme-builder');

// the raw model definition coming from the scheme file:
let _modelDefinition = new WeakMap();

// the parsed property map (the outcome of parsing function below)
let _propertyMap = new WeakMap();

/**
 * The class wrapping the model
 * @type {module.SchemeModel}
 */
module.exports =  class SchemeModel {

    constructor(definition){
        _modelDefinition.set(this, definition);
        _propertyMap.set(this,scanDefinition(definition));
    }
    // Returns a builder pattern for object creation from the model:
    get builder(){
        return new builder(_propertyMap.get(this));
    }
    // Returns the parsed property model for inspection
    get propertyModel(){
        return _propertyMap.get(this);
    }
}

/**
 * A private function that parses a scheme file and produces the property map.
 * @param definition
 */
let scanDefinition = function(definition){

    let propertyMap = {};

    if (definition.properties){
        //loop over all the elements in the 'properties' field of the scheme file:
        Object.keys(definition.properties).forEach(function(val){

            let requiredFields = definition.required;
            let propertyDefinition = definition.properties[val];
            let type = propertyDefinition.type;

            //if its a sub-structure, call this method recursively on the sub structure:
            if (type === 'object'){
                propertyMap[val] = scanDefinition(propertyDefinition);
                propertyMap[val].isNested = true;
            } else {
                let isEnum = (propertyDefinition.hasOwnProperty('enum'));
                let isRequired = requiredFields.includes(val);

                let schemeProperty = {
                    required: isRequired
                };

                //if its an enum, treat is special. if only 1 enum value available, consider it hard coded into any
                //  generated models:
                if (isEnum){
                    schemeProperty.validator = function(val){
                        return propertyDefinition.enum.includes(val);
                    };
                    if (propertyDefinition.enum.length == 1){
                        schemeProperty.constant = propertyDefinition.enum[0];
                    }
                //otherwise treat it as regular type, and try to match against known data-types:
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
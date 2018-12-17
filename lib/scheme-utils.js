'use strict';

/**
 * A helper function that compares a JSON instance against a model map.
 * @param map The definition of what a good instance looks like.
 * @param model An instance of a model to examine.
 */
let validateModelFn = function(map, model){

    let returnErrors = {};

    // Iterate over the map, this way extra properties in the model are ignored.
    //   This is important for backwards compatibility
    Object.keys(map).forEach(function(key) {

        let required = map[key].required;
        let type = map[key].type;

        // a couple different ways of defining the validator, so check all.
        let validator = null;
        let serializer = null;
        if (type){
            //try to pull validator and serializer from the generic type:
            validator  = type.validator;
            serializer = type.serializer;
        }
        else {
            //check if validator was explictly overridden
            validator = map[key].validator;
            serializer = map[key].serializer;
        }

        //use the serializer if one is specified:
        let val = model[key];
        if (serializer && val) val = serializer(val);

        //check if the key represents a sub structure:
        if (!validator && val && typeof val === 'object'){

            let subModel = val;
            //assume sub structures are always required:
            if (!subModel){
                returnErrors[key] = 'Required property \'' + key + '\' not provided';
                //call the validateFn on them recursively:
            } else {
                let innerErrors = validateModelFn(map[key], subModel);
                if (Object.keys(innerErrors).length > 0){
                    returnErrors[key] = innerErrors;
                }
            }

            //check if key is optional. if not, expect a value:
        } else if (required && (!val)) {
            returnErrors[key]  = 'Required property \'' + key + '\' not provided';
            //if value was given, check against validator:
        } else if (val && !validator(val)) {
            returnErrors[key]  = 'Property \'' + key + '\' was not valid. Supplied value was: ' + val;
        }
    });

    return returnErrors;
};

module.exports = {
    validateModelFn: validateModelFn
};
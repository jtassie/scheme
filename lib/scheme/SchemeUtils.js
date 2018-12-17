'use strict';

const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const types = {
    string: {
        validator: function(val){
            return true;
        },
        serializer: function(val){
            return val.toString();
        }
    },
    integer: {
        validator: function(val){
            return val === parseInt(val, 10);
        }
    },
    uuid: {
        validator: function(val){
            return uuidRegex.test(val);
        }
    },
    iso8601Date: {
        validator: function(val){
            return Object.prototype.toString.call(val) === '[object Date]'
                && val.toString() != 'Invalid Date';
        },
        serializer: function(val){
            if (typeof val === 'string'){
                return new Date(val);
            } else return val;
        }
    }
};

let validateModelFn = function(map, model){

    let returnErrors = {};

    Object.keys(map).forEach(function(key) {

        console.debug(key + ": " + model[key]);

        let required = map[key].required;
        let type = map[key].type;

        let validator = null;
        let serializer = null;
        if (type){
            validator  = type.validator;
            serializer = type.serializer;
        }
        else {
            validator = map[key].validator;
            serializer = map[key].serializer;
        }

        let val = model[key];
        if (serializer) val = serializer(val);

        //check if the key represents a sub structure:
        if (!validator){

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

            //check if key is optional:
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
    validateModelFn: validateModelFn,
    types: types
};

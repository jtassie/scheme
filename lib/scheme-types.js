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
    timestamp: {
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

module.exports = types;
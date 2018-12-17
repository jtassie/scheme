'use strict';

/**
 * Created by  scheme-gen tool on {DATE}
 */

let utils = require('./SchemeUtils');

let _type = new WeakMap();
let _userId = new WeakMap();

let _body = new WeakMap();
let _bodyText = new WeakMap();
let _bodyMessageId = new WeakMap();
let _bodyTimestamp = new WeakMap();

const _propertyMap = {
    type: {
        required: true,
        validator: function(val){ return val === 'IM';}
    },
    userId: {
        required: true,
        type: utils.types.string
    },
    body: {
        text: {
            required: true,
            type: utils.types.string
        },
        messageId: {
            required: true,
            type: utils.types.uuid
        },
        timestamp: {
            required: true,
            type: utils.types.iso8601Date
        }
    }
};

class InstantMessageModelBody {

    constructor(builder){
        this.text = _bodyText.get(builder);
        this.messageId = _bodyMessageId.get(builder);
        this.timestamp = _bodyTimestamp.get(builder);
    }

    static get Builder(){

        let modelDefinition = _propertyMap.body;

        class Builder {
            constructor(){}
            withText(text){
                _bodyText.set(this, text);
                return this;
            }
            withMessageId(messageId){
                _bodyMessageId.set(this, messageId);
                return this;
            }
            withTimestamp(timestamp){
                _bodyTimestamp.set(this, timestamp);
                return this;
            }
            validate(validationCb){
                return Builder.validateModel(this, validationCb);
            }
            static validateModel(model, validationCb) {

                let validationResult = utils.validateModelFn(modelDefinition, model);
                if (Object.keys(validationResult).length > 0 && validationCb){
                    validationCb(validationResult);
                }
                return validationResult;
            }
            build(validationCb){

                let model = new InstantMessageModelBody(this);
                Builder.validateModel(model, validationCb);
                return model;
            }
        }
        return Builder;
    }
}

class InstantMessageModel {

    constructor(builder){
        this.type = _type.get(builder);
        this.userId = _userId.get(builder);
        this.body = _body.get(builder);
    }

    static get Builder(){

        let modelDefinition = _propertyMap;

        class Builder {
            constructor(){}
            withUserId(userId){
                _userId.set(this, userId);
                return this;
            }
            withBody(body){
                _body.set(this,body);
                return this;
            }
            validate(){
                return Builder.validateModel(this);
            }
            static validateModel(model, validationCb) {

                let validationResult = utils.validateModelFn(modelDefinition, model);
                if (Object.keys(validationResult).length > 0 && validationCb){
                    validationCb(validationResult);
                }
                return validationResult;
            }
            build(validationCb){

                _type.set(this, 'IM');

                let model = new InstantMessageModel(this);
                Builder.validateModel(model, validationCb);
                return model;
            }
        }
        return Builder;
    }
}

module.exports = {
    Builder: InstantMessageModel.Builder,
    BodyBuilder: InstantMessageModelBody.Builder
};
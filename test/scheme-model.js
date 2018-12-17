let expect    = require("chai").expect;

let schemeModel = require("../lib/scheme-model");
let types = require("../lib/scheme-types");

const imScheme = require('./schemes/im.json');

describe("model parsing", function(){

    it("validates that models are parsed properly from scheme files", function() {

        let model = new schemeModel(imScheme).propertyModel;
        expect(model).to.have.keys(['body', 'type', 'userID']);
        expect(model.body).to.have.keys(['timestamp', 'messageID', 'text', 'isNested']);
        expect(model.body.timestamp.required).equal(true);
        expect(model.type.constant).equal('IM');
        expect(model.body.messageID.type).equal(types.uuid);
        expect(model.body.timestamp.type).equal(types.timestamp);
    });
});
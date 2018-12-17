let expect    = require("chai").expect;
var resolve = require('path').resolve

let schemeManager = require("../lib/scheme-manager");

const testSchemesDir = resolve('./test/schemes');

describe("builder tests", function(){

    describe("the builder pattern for object creation works", function() {

        it("positive cases", function() {
            let validationResults = {};
            let validationCb = function (results) {
                validationResults = results;
            };

            let manager = new schemeManager(testSchemesDir);
            let builder = manager.getModel("IM").builder;

            let im = builder
                .withUserId('jtassie')
                .withBody(
                    builder.builderBody
                        .withText('sdfsdfsd')
                        .withMessageId('123e4567-e89b-12d3-a456-426655440000')
                        .withTimestamp(new Date())
                        .build()
                )
                .build(validationCb);

            expect(0).equal(Object.keys(validationResults).length);
        });

        it("negative cases", function() {
            let validationResults = {};
            let validationCb = function (results) {
                validationResults = results;
            };

            let manager = new schemeManager(testSchemesDir);
            let builder = manager.getModel("IM").builder;

            let im = builder
                .withUserId('jtassie')
                .withBody(
                    builder.builderBody
                        .withText('sdfsdfsd')
                        .withTimestamp(new Date())
                        .build()
                )
                .build(validationCb);

            expect(1).equal(Object.keys(validationResults).length);
            expect('Required property \'messageID\' not provided').equal(validationResults.body.messageID);
        });

        it("validation errors", function() {
            let validationResults = {};
            let validationCb = function (results) {
                validationResults = results;
            };

            let manager = new schemeManager(testSchemesDir);
            let builder = manager.getModel("IM").builder;

            let im = builder
                .withUserId('jtassie')
                .withBody(
                    builder.builderBody
                        .withText('sdfsdfsd')
                        .withMessageId('123e4567-e89b- END')
                        .withTimestamp(new Date())
                        .build()
                )
                .build(validationCb);

            expect(1).equal(Object.keys(validationResults).length);
            expect('Property \'messageID\' was not valid. Supplied value was: 123e4567-e89b- END').equal(validationResults.body.messageID);
        });

        it("optionals are indeed optional", function() {
            let validationResults = {};
            let validationCb = function (results) {
                validationResults = results;
            };

            let manager = new schemeManager(testSchemesDir);
            let builder = manager.getModel("SMS").builder;

            let sms = builder
                .withPhoneNumber('902-233-4566')
                .withBody(
                    builder.builderBody
                        .withText('sdfsdfsd')
                        .withTimestamp(new Date())
                        .build()
                )
                .build(validationCb);

            expect(0).equal(Object.keys(validationResults).length);
        });
    });
});
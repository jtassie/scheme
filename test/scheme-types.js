let expect    = require("chai").expect;
let types = require("../lib/scheme-types");

describe("type tests", function(){

    it("validates UUIDs", function() {
        expect(false).equal(types.uuid.validator("32323"));
        expect(true).equal(types.uuid.validator("123e4567-e89b-12d3-a456-426655440000"));
    });

    it("validates dates", function() {
        expect(false).equal(types.timestamp.validator("2018-12-16T23:39:49.157Z3434343dd"));
        expect(false).equal(types.timestamp.validator("dsfsdf ??"));
        expect(true).equal(types.timestamp.validator(new Date()));
    });

    it("validates numbers", function() {
        expect(false).equal(types.integer.validator("2018-12-16T23:39:49.157Z3434343dd"));
        expect(false).equal(types.integer.validator("dsfsdf ??"));
        expect(true).equal(types.integer.validator(11));
    });
});
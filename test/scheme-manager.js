let expect    = require("chai").expect;
var resolve = require('path').resolve

let schemeManager = require("../lib/scheme-manager");

const testSchemesDir = resolve('./test/schemes');
const imScheme = require('./schemes/im.json');

describe("manager tests", function(){

    it("reads the IM scheme file", function() {

        let manager = new schemeManager(testSchemesDir);
        expect(true).equal(manager.hasScheme("IM"));
        expect(true).equal(manager.hasScheme("SMS"));
        expect(false).equal(manager.hasScheme("sdfsdfsdfdsfdsf"));
    });

    it("it returns the scheme files properly", function() {
        let manager = new schemeManager(testSchemesDir);
        expect(imScheme).equal(manager.getScheme("IM"));
    });

    it("it returns all the scheme files", function() {
        let manager = new schemeManager(testSchemesDir);
        expect(2).equal(manager.getSchemes().length);
    });
});
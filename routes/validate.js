var express = require('express');
var router = express.Router();

var InstantMessageModel = require('../lib/scheme/InstantMessageModel');

const _builderTypeMap = {
    IM: InstantMessageModel.Builder
};

router.post('/', function(req, res, next) {

    let body = req.body;
    let type = body['type'];
    if (!type) {
        res.send('failed to send \'type\' property identifying the message type.');
        return;
    }

    let builder = _builderTypeMap[type];
    if (!builder){
        res.send('did not resolve \'type\' property to a known message format.')
        return;
    }

    let validationResults = builder.validateModel(body);
    if (Object.keys(validationResults).length > 0){
        res.status(400);
        res.send(validationResults);
    } else {
        res.status(200);
        res.send();
    }
});

module.exports = router;

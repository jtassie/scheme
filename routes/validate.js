let express = require('express');
let router = express.Router();

router.post('/', function(req, res, next) {

    let body = req.body;
    let type = body['type'];
    if (!type) {
        res.send('failed to send \'type\' property identifying the message type.');
        return;
    }
    let schemeManager = req.app.get('schemeManager');
    if (!schemeManager.hasScheme(type)){
        res.send('did not resolve \'type\' property to a known message format.');
        return;
    }

    let builder = schemeManager.getModel(type).builder;
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
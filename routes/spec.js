let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {

    let schemeManager = req.app.get('schemeManager');
    res.send(schemeManager.getSchemes());
});

router.get('/:type', function(req, res, next) {

    let type = req.params.type;
    let schemeManager = req.app.get('schemeManager');

    if (schemeManager.hasScheme(type)){
        res.send(schemeManager.getScheme(type));
    } else {
        res.status(404);
        res.send();
    }
});

module.exports = router;

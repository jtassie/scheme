let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  let validationResults = {};
  let validationCb = function(results){ validationResults = results;};

  let imModel = req.app.get('schemeManager').getModel('IM');

  let im = imModel.builder
      .withUserId('jtassie')
      .withBody(
          imModel.builder.builderBody
              .withText('sdfsdfsd')
              .withMessageId('123e4567-e89b-12d3-a456-426655440000')
              .withTimestamp(new Date())
              .build()
      )
      .build(validationCb);

  if (Object.keys(validationResults).length > 0) res.send(validationResults);
  else res.send(im);
});

module.exports = router;
var express = require('express');
var router = express.Router();

var InstantMessageModel = require('../lib/scheme/InstantMessageModel');

/* GET users listing. */
router.get('/', function(req, res, next) {

  let validationResults = {};
  let validationCb = function(results){ validationResults = results;};

  let im = new InstantMessageModel.Builder()
      .withUserId('jtassie')
      .withBody(
          new InstantMessageModel.BodyBuilder()
              .withText('sdfsdfsd')
              .withMessageId('123e4567-e89b-12d3-a456-426655440000')
              .withTimestamp(new Date())
              .build(validationCb)
      )
      .build(validationCb);

  if (Object.keys(validationResults).length > 0) res.send(validationResults);
  else res.send(im);
});

module.exports = router;

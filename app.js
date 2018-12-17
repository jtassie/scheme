var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var resolve = require('path').resolve

var schemeManager = require('./lib/scheme-manager');

var testRouter = require('./routes/test');
var validateRouter = require('./routes/validate');
var specRouter = require('./routes/spec');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/test', testRouter);
app.use('/validate', validateRouter);
app.use('/spec', specRouter);

app.set('schemeManager', new schemeManager(resolve('./public/schemes')));

module.exports = app;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const requestLogger = require('morgan');
const bodyParser = require('body-parser');
const NotFoundError = require('./core/errors/not-found');
const responseHandler = require('response-handler');
const requestParser = require('request-parser');
const db = require('./db/models/index')

// require('./workers');

const logger = require('logger');

const routes = require('./routes/index');

const app = express();

app.use(requestLogger('common', { stream: logger.stream }));

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(requestParser());

app.use('/v1', routes);

app.use('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send(200, 'Ok');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((req, res, next) => {
  next(new NotFoundError());
});

// error handler
app.use((err, req, res) => {
  responseHandler.handleError(err, res);
});
module.exports = app;

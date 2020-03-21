const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

require('dotenv').config({ path: envPath });

const app = require('express')();
const requireDir = require('require-dir');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sentry = require('./app/services/sentry');

const dbConfig = require('./config/database');

mongoose.connect(dbConfig.url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
requireDir(dbConfig.modelsPath);

app.use(bodyParser.json());
app.use(sentry.Handlers.requestHandler());

app.use('/api', require('./app/routes'));

app.use(sentry.Handlers.errorHandler());

app.listen(3000);

module.exports = app;

const Sentry = require('@sentry/node');

const sentryConfig = require('../../config/sentry');

Sentry.init({ dsn: sentryConfig.sentryDSN });

module.exports = Sentry;

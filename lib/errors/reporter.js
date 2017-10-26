const raven = require('raven');
const winston = require('winston');

module.exports = (error, local = true, external = true) => {
    if (external && process.env.SENTRY_DSN) {
        raven.captureException(error);
    }

    if (local) {
        winston.log('error', error);
    }
};
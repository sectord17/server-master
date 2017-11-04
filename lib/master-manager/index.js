const winston = require('winston');

module.exports = exports = class MasterManager {
    booted() {
        winston.log('info', 'Master is up!');
    }
};

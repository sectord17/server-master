let Server = require('./server');

module.exports = function(app) {
    let servers = [
        new Server('127.0.0.1', 2000),
        new Server('127.0.0.1', 2001),
        new Server('127.0.0.1', 2002),
    ];

    return {
        all() {
            return servers.slice();
        }
    }
};
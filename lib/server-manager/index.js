const Server = require('./server');
const ServerSlave = require('../apis/server-slave');
const debug = require('debug')('sectord17-master:server-manager');
const BasicError = require('../errors/basic-error');
const ModelNotFoundError = require('../errors/model-not-found-error');

module.exports = function () {
    const servers = new Map();
    const slave = new ServerSlave(process.env.SERVER_SLAVE_URL, process.env.SERVER_SLAVE_TOKEN);

    const getServer = function (serverId) {
        return new Promise((resolve, reject) => {
            const server = servers.get(serverId);

            if (server) {
                return resolve(server);
            }

            return reject(new ModelNotFoundError("server"));
        });
    };

    return {
        all() {
            return Array.from(servers.values());
        },

        create(id, name) {
            if (servers.has(id)) {
                return Promise.reject(new BasicError("server-exists"));
            }

            return slave.createServer(id)
                .then(data => {
                    let server = new Server(id, name, data.ip, data.port);
                    servers.set(server.id, server);

                    debug(server);

                    return server;
                });
        },

        destroy(serverId) {
            return getServer(serverId)
                .then(server => Promise.all([server, slave.destroyServer(server.id)]))
                .then(([server]) => {
                    servers.delete(server.id);
                    debug(server);

                    return server;
                });
        },

        decide(serverId) {
            return getServer(serverId)
                .then(server => Promise.all([server, slave.decide(server.id)]))
                .then(([server, token]) => [token, server]);
        }
    }
};
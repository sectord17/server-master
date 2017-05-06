const Server = require('./server');
const ServerSlave = require('../apis/server-slave');
const debug = require('debug')('sectord17:server-manager');

module.exports = function () {
    let servers = new Map();
    let slave = new ServerSlave(process.env.SERVER_SLAVE_URL);

    const getServerOrFail = function (serverId) {
        const server = servers.get(serverId);

        if (server) {
            return server;
        }

        throw new Error("model-not-found");
    };

    return {
        all() {
            return Array.from(servers.values());
        },

        create(id, name) {
            if (servers.has(id)) {
                throw new Error("server-exists");
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
            const server = getServerOrFail(serverId);

            return slave.destroyServer(server.id)
                .then(() => {
                    servers.delete(server.id);
                    debug(server);

                    return server;
                });
        },

        join(serverId) {
            const server = getServerOrFail(serverId);

            return slave.join(server.id)
                .then(token => [token, server]);
        }
    }
};
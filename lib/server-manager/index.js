const Server = require('./server');
const ServerSlave = require('../apis/server-slave');
const debug = require('debug')('sectord17:server-manager');

module.exports = function () {
    let servers = [];
    let slave = new ServerSlave(process.env.SERVER_SLAVE_URL);

    const getServerIndex = function (serverId) {
        for (let i = 0; i < servers.length; ++i) {
            if (servers[i].id === serverId) {
                return i;
            }
        }

        return null;
    };

    const getServerIndexPromise = function (serverId) {
        return new Promise((resolve, reject) => {
            const serverIndex = getServerIndex(serverId);

            if (serverIndex === null) {
                return reject(new Error("model-not-found"));
            }

            return resolve(serverIndex);
        });
    };

    const getServerPromise = function (serverId) {
        return getServerIndexPromise(serverId)
            .then(serverIndex => servers[serverIndex]);
    };

    return {
        all() {
            return servers.slice();
        },

        create(id, name) {
            return slave.createServer(id)
                .then(data => {
                    let server = new Server(id, name, data.ip, data.port);
                    servers.push(server);

                    console.log(`Server ${server.id} was created`);
                    debug(server);

                    return server;
                });
        },

        destroy(serverId) {
            return getServerIndexPromise(serverId)
                .then(serverIndex => slave.destroyServer(serverId))
                .then(() => getServerIndexPromise(serverId))
                .then(serverIndex => {
                    let server = servers[serverIndex];

                    servers.splice(serverIndex, 1);

                    console.log(`Server ${server.id} was destroyed`);
                    debug(server);

                    return server;
                });
        },

        join(serverId) {
            return getServerPromise(serverId)
                .then(server => slave.join(server.id))
                .then(token => [token, server]);
        }
    }
};
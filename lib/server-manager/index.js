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

    const getServerIndexOrFail = function (serverId) {
        const serverIndex = getServerIndex(serverId);

        if (serverIndex === null) {
            throw "Server not found";
        }

        return serverIndex;
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
                });
        },

        destroy(serverId) {
            return slave.destroyServer(serverId)
                .then(() => {
                    let serverIndex = getServerIndexOrFail(serverId);
                    let server = servers[serverIndex];

                    servers.splice(serverIndex, 1);

                    console.log(`Server ${server.id} was destroyed`);
                    debug(server);
                });
        },

        join(serverId) {
            let serverIndex = getServerIndexOrFail(serverId);
            let server = servers[serverIndex];

            return slave.join(server.id)
                .then(token => Promise.all([token, server]));
        }
    }
};
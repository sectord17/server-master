const Server = require('./server');
const ServerSlave = require('../apis/server-slave');

module.exports = function (app) {
    let servers = [];
    let slave = new ServerSlave(process.env.SERVER_SLAVE_URL, app);

    let getServerIndexById = function (id) {
        for (let i = 0; i < servers.length; ++i) {
            if (servers[i].id === id) {
                return i;
            }
        }

        return null;
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
                    app.debug(server);
                });
        },

        destroy(serverId) {
            return slave.destroyServer(serverId)
                .then(() => {
                    let serverIndex = getServerIndexById(serverId);
                    let server = servers[serverIndex];

                    servers.splice(serverIndex, 1);

                    console.log(`Server ${server.id} was destroyed`);
                    app.debug(server);
                });
        },

        join(serverId) {
            return slave.join(serverId);
        }
    }
};
const Server = require('./server');
const ServerSlave = require('../apis/server-slave');

module.exports = function (app) {
    let servers = [];
    let slave = new ServerSlave(process.env.SERVER_SLAVE_URL);

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
            slave.createServer(id, data => {
                let server = new Server(id, name, data.ip, data.port);
                servers.push(server);

                app.debug(`Server ${server.id} was created`);
            });
        },

        destroy(serverId) {
            slave.destroyServer(serverId, () => {
                servers.splice(getServerIndexById(serverId), 1);

                app.debug(`Server ${serverId} was destroyed`);
            });
        },

        join(serverId, onJoin, onError) {
            slave.join(serverId, onJoin, onError);
        }
    }
};
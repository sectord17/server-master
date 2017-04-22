let Server = require('./server');
let ServerSlave = require('../apis/server-slave');

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
            slave.createServer(id, response => {
                let server = new Server(id, name, response.ip, response.port);
                servers.push(server);

                app.debug(`Server ${server.id} was created`);
            });
        },

        destroy(id) {
            slave.destroyServer(id, () => {
                servers.splice(getServerIndexById(id), 1);

                app.debug(`Server ${id} was destroyed`);
            });
        }
    }
};
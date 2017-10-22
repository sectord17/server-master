const Server = require('./server');
const ServerSlave = include('/lib/apis/server-slave');
const debug = require('debug')('sectord17-master:server-manager');
const ModelNotFoundError = include('/lib/errors/model-not-found-error');

module.exports = exports = class ServerManager {
    constructor() {
        this.servers = new Map();
        this.serversCounter = 0;
        this.slave = new ServerSlave(process.env.SERVER_SLAVE_URL, process.env.SERVER_SLAVE_TOKEN);
    }

    /**
     * @returns {Array}
     */
    all() {
        return Array.from(this.servers.values());
    }

    create(name) {
        const id = ++this.serversCounter;

        return this.slave
            .createServer(id)
            .then(data => {
                const server = new Server(id, name, data.ip, data.port);
                this.servers.set(server.id, server);

                debug(server);

                return server;
            });
    }

    destroy(serverId) {
        return this._getServer(serverId)
            .then(server => Promise.all([server, this.slave.destroyServer(server.id)]))
            .then(([server]) => {
                this.servers.delete(server.id);

                debug(server);

                return server;
            });
    }

    decide(serverId) {
        return this._getServer(serverId)
            .then(server => Promise.all([server, this.slave.decide(server.id)]))
            .then(([server, token]) => [token, server]);
    }

    _getServer(serverId) {
        return new Promise((resolve, reject) => {
            const server = this.servers.get(serverId);

            if (server) {
                return resolve(server);
            }

            return reject(new ModelNotFoundError("server"));
        });
    }
};

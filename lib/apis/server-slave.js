const axios = require('axios');
const debug = require('debug')('sectord17:server-slave');

module.exports = class ServerSlave {
    constructor(url) {
        this.url = url;
    }

    createServer(serverId) {
        return new Promise(function (resolve, reject) {
            axios.post(this.url + '/servers', {serverId})
                .then(response => resolve(response.data))
                .catch(error => {
                    debug(error);
                    reject(error);
                });
        }.bind(this));
    }

    destroyServer(serverId) {
        return new Promise(function (resolve, reject) {
            axios.delete(this.url + `/servers/${serverId}`)
                .then(response => resolve(response.data))
                .catch(error => {
                    debug(error);
                    reject(error);
                });
        }.bind(this));
    }

    join(serverId) {
        return new Promise(function (resolve, reject) {
            axios.post(this.url + `/servers/${serverId}/join`)
                .then(response => resolve(response.data.token))
                .catch(error => {
                    debug(error);
                    reject(error);
                });
        }.bind(this));
    }
};
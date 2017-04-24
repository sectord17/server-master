let axios = require('axios');

module.exports = class ServerSlave {
    constructor(url, app) {
        this.url = url;
        this.app = app;
    }

    createServer(serverId) {
        return new Promise(function (resolve, reject) {
            axios.post(this.url + '/servers', {serverId})
                .then(response => resolve(response.data))
                .catch(error => {
                    this.app.debug(error);
                    reject(error);
                });
        }.bind(this));
    }

    destroyServer(serverId) {
        return new Promise(function (resolve, reject) {
            axios.delete(this.url + `/servers/${serverId}`)
                .then(response => resolve(response.data))
                .catch(error => {
                    this.app.debug(error);
                    reject(error);
                });
        }.bind(this));
    }

    join(serverId) {
        return new Promise(function (resolve, reject) {
            axios.post(this.url + `/servers/${serverId}/join`)
                .then(response => resolve(response.data))
                .catch(error => {
                    this.app.debug(error);
                    reject(error);
                });
        }.bind(this));
    }
};
const axios = require('axios');
const debug = require('debug')('sectord17:server-slave');

module.exports = class ServerSlave {
    constructor(url) {
        this.url = url;
    }

    createServer(serverId) {
        return axios.post(this.url + '/servers', {serverId})
            .then(response => response.data)
            .catch(error => {
                debug(error);
                throw error;
            });
    }

    destroyServer(serverId) {
        return axios.delete(this.url + `/servers/${serverId}`)
            .then(response => response.data)
            .catch(error => {
                debug(error);
                throw error;
            });
    }

    join(serverId) {
        return axios.post(this.url + `/servers/${serverId}/join`)
            .then(response => response.data.token)
            .catch(error => {
                debug(error);
                throw error;
            });
    }
};
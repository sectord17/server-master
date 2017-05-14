const axios = require('axios');
const debug = require('debug')('sectord17-master:server-slave');
const BasicError = require('../errors/basic-error');

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

    decide(serverId) {
        return axios.post(this.url + `/servers/${serverId}/decide`)
            .then(response => response.data.token)
            .catch(error => {
                const response = error.response;
                if (response && response.status === 403) {
                    throw new BasicError(response.data.code);
                }

                throw error;
            })
            .catch(error => {
                debug(error);
                throw error;
            });
    }
};
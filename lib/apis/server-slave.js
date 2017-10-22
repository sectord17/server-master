const axios = require('axios');
const debug = require('debug')('sectord17-master:server-slave');
const BasicError = include('/lib/errors/basic-error');

module.exports = exports = class ServerSlave {
    constructor(url, token) {
        this.url = url;
        this.token = token;
    }

    createServer(serverId) {
        return axios.post(this.url + '/servers', {serverId}, this._getConfig())
            .then(response => response.data)
            .catch(error => {
                debug(error);
                throw error;
            });
    }

    destroyServer(serverId) {
        return axios.delete(this.url + `/servers/${serverId}`, this._getConfig())
            .then(response => response.data)
            .catch(error => {
                debug(error);
                throw error;
            });
    }

    decide(serverId) {
        return axios.post(this.url + `/servers/${serverId}/decide`, {}, this._getConfig())
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

    _getConfig() {
        return {
            headers: {
                'authorization': this.token
            }
        };
    }
};
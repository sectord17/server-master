const axios = require('axios');
const debug = require('debug')('sectord17-master:slave-sdk');
const BasicError = include('/lib/errors/basic-error');

module.exports = exports = class SlaveSDK {
    constructor(url, token) {
        this.url = url;
        this.token = token;
    }

    createGame(gameId) {
        return axios.post(this.url + '/games', {gameId}, this._getConfig())
            .then(response => response.data)
            .catch(error => {
                debug(error);
                throw error;
            });
    }

    destroyGame(gameId) {
        return axios.delete(this.url + `/games/${gameId}`, this._getConfig())
            .then(response => response.data)
            .catch(error => {
                debug(error);
                throw error;
            });
    }

    decide(gameId) {
        return axios.post(this.url + `/games/${gameId}/decide`, {}, this._getConfig())
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
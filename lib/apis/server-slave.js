let axios = require('axios');

module.exports = class ServerSlave {
    constructor(url) {
        this.url = url;
    }

    createServer(serverId, onCreate, onError) {
        axios.post(this.url + '/servers', {serverId})
            .then(response => {
                if (onCreate) {
                    onCreate(response.data);
                }
            })
            .catch(error => {
                if (onError) {
                    onError(error);
                }
            })
    }

    destroyServer(serverId, onDestroy, onError) {
        axios.delete(this.url + `/servers/${serverId}`)
            .then(response => {
                if (onDestroy) {
                    onDestroy(response.data);
                }
            })
            .catch(error => {
                if (onError) {
                    onError(error);
                }
            });
    }

    join(serverId, onJoin, onError) {
        axios.post(this.url + `/servers/${serverId}/join`)
            .then(response => {
                if (onJoin) {
                    onJoin(response.data);
                }
            })
            .catch(error => {
                if (onError) {
                    onError(error);
                }
            });
    }
};
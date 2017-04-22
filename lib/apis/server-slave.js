let axios = require('axios');

module.exports = class ServerSlave {
    constructor(url) {
        this.url = url;
    }

    createServer(id, onCreate) {
        axios.post(this.url + '/servers', {id})
            .then(function (response) {
                onCreate(response.data);
            });
    }

    destroyServer(id, onDestroy) {
        axios.delete(this.url + '/servers/' + id)
            .then(function (response) {
                onDestroy(response.data);
            });
    }
};
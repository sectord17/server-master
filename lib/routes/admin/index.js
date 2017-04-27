module.exports = function (serverManager) {
    const express = require('express');
    const router = express.Router();

    router.post('/servers', function (request, response) {
        // TODO: Validate request

        const serverId = request.body.id;
        const serverName = request.body.name;

        serverManager.create(serverId, serverName)
            .then(server => response.send(server))
            .catch(error => response.status(500).send(error));
    });

    router.delete('/servers/:serverId', function (request, response) {
        const serverId = request.params.serverId;

        serverManager.destroy(serverId)
            .then(() => response.sendStatus(200))
            .catch(error => response.status(500).send(error));
    });

    return router;
};

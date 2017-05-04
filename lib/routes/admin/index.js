module.exports = function (serverManager) {
    const express = require('express');
    const router = express.Router();

    router.post('/servers', (request, response, next) => {
        // TODO: Validate request

        const serverId = request.body.id;
        const serverName = request.body.name;

        serverManager.create(serverId, serverName)
            .then(server => response.send(server))
            .catch(error => next(error));
    });

    router.delete('/servers/:serverId', (request, response, next) => {
        const serverId = request.params.serverId;

        serverManager.destroy(serverId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    return router;
};

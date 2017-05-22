const express = require('express');

module.exports = function (serverManager) {
    const router = express.Router();

    // Authorize every request
    const token = process.env.TOKEN;
    router.use('', (request, response, next) => {
        if (token !== request.headers.authorization) {
            return response.sendStatus(401);
        }

        return next();
    });

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

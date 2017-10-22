const express = require('express');

module.exports = () => {
    const {serverManager} = include('/lib');
    const router = express.Router();

    // Authorize every request
    const token = process.env.TOKEN;
    router.use('', (request, response, next) => {
        if (token !== request.headers.authorization) {
            return response.sendStatus(401);
        }

        return next();
    });

    router.delete('/servers/:serverId', (request, response, next) => {
        const serverId = request.params.serverId;

        serverManager.destroy(serverId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    return router;
};

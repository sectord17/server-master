const express = require('express');
const debug = require('debug')('sectord17-master:routes-info');

module.exports = () => {
    const {gameManager} = include('/lib');
    const router = express.Router();

    // Authorize every request
    const token = process.env.TOKEN;
    router.use('', (request, response, next) => {
        if (token !== request.headers.authorization) {
            return response.sendStatus(401);
        }

        return next();
    });

    router.post('/games/:gameId/shutdown', (request, response) => {
        const gameId = parseInt(request.params.gameId);

        gameManager
            .getGame(gameId)
            .then(game => gameManager.onShutdown(game))
            .catch(error => debug(error));

        response.sendStatus(200);
    });

    return router;
};

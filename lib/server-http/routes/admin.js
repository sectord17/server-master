const express = require('express');

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

    router.delete('/games/:gameId', (request, response, next) => {
        const gameId = request.params.gameId;

        gameManager.destroy(gameId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    return router;
};

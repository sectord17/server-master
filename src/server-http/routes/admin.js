const express = require('express');
const {getValidEnv} = require('../../utils');
const transformGame = include('/src/transformers/game-transformer');

module.exports = () => {
    const {gameManager} = include('/src');
    const router = express.Router();

    // Authorize every request
    const token = getValidEnv('TOKEN');
    router.use('', (request, response, next) => {
        if (token !== request.headers.authorization) {
            return response.sendStatus(401);
        }

        return next();
    });

    router.get('/games', (request, response) => {
        const games = gameManager.all().map(game => transformGame(game));
        response.send(games);
    });


    router.delete('/games/:gameId', (request, response, next) => {
        const gameId = request.params.gameId;

        gameManager.shutdown(gameId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    return router;
};

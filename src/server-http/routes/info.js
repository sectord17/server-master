const express = require('express');
const debug = require('debug')('sectord17-master:routes-info');
const ModelNotFoundError = include('/src/errors/model-not-found-error');
const {getValidEnv} = require('../../utils');

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

    /**
     * @api {post} /info/games/:game/shutdown Inform about game shutdown
     * @apiVersion 0.0.1
     * @apiGroup Internal
     *
     * @apiExample {json} Request:
     *      POST /info/games/1/shutdown
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     */
    router.post('/games/:gameId/shutdown', (request, response) => {
        const gameId = parseInt(request.params.gameId);

        gameManager
            .getGame(gameId)
            .then(game => gameManager.onShutdown(game))
            .catch(error => {
                // Model not found means server was already removed from master somehow
                if (error instanceof ModelNotFoundError) {
                    return;
                }

                debug(error)
            });

        response.sendStatus(200);
    });

    return router;
};

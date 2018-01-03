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

    /**
     * @api {get} /admin/games Get list of games
     * @apiVersion 0.0.1
     * @apiGroup Admin
     *
     * @apiExample {json} Request:
     *      GET /admin/games
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      [
     *          {
     *              id: 1,
     *              name: 'Test',
     *              ip: '192.0.2.1',
     *              port: 3000
     *              players_count: 1,
     *              status: 0
     *          },
     *          {
     *              id: 2,
     *              name: 'Example',
     *              ip: '192.0.2.2',
     *              port: 2000
     *              players_count: 8,
     *              status: 1
     *          }
     *      ]
     */
    router.get('/games', (request, response) => {
        const games = gameManager.all().map(game => transformGame(game));
        response.send(games);
    });

    /**
     * @api {delete} /admin/games/:game Shutdown the game
     * @apiVersion 0.0.1
     * @apiGroup Admin
     *
     * @apiExample {json} Request:
     *      DELETE /admin/games/1
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     */
    router.delete('/games/:gameId', (request, response, next) => {
        const gameId = request.params.gameId;

        gameManager.shutdown(gameId)
            .then(() => response.sendStatus(200))
            .catch(error => next(error));
    });

    return router;
};

const express = require('express');
const transformGame = include('/lib/transformers/game-transformer');
const transformGameBasic = include('/lib/transformers/basic-game-transformer');

module.exports = () => {
    const {gameManager} = include('/lib');
    const router = express.Router();

    /**
     * @api {get} /games Get list of games
     * @apiVersion 0.0.1
     * @apiGroup Games
     *
     * @apiExample {json} Request:
     *      GET /games
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      [
     *          {
     *              id: 1,
     *              name: 'Test',
     *              players_count: 1
     *          },
     *          {
     *              id: 2,
     *              name: 'Example',
     *              players_count: 8
     *          }
     *      ]
     */
    router.get('/', (req, res) => {
        const games = gameManager.all()
            .map(game => transformGameBasic(game));

        res.send(games);
    });

    /**
     * @api {post} /games Create the game
     * @apiVersion 0.0.1
     * @apiGroup Games
     *
     * @apiParam {String} name Name of the game
     * @apiExample {json} Request:
     *      POST /games
     *      {
     *          name: 'Test'
     *      }
     *
     * @apiSuccess {Integer} id Id of the game
     * @apiSuccess {String} name Name of the game
     * @apiSuccess {String} ip IP of the game
     * @apiSuccess {Integer} port Port of the game
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          id: 1,
     *          name: 'Test',
     *          ip: '155.155.155.155',
     *          port: 8001
     *      }
     */
    router.post('/', (request, response, next) => {
        const gameName = request.body.name;

        gameManager
            .create(gameName)
            .then(game => response.send(transformGame(game)))
            .catch(error => next(error));
    });

    /**
     * @api {post} /games/:gameId/decide Decide to join the game
     * @apiVersion 0.0.1
     * @apiGroup Games
     *
     * @apiExample {json} Request:
     *      POST /games/1/decide
     *
     * @apiSuccess {String} token Authorization token
     * @apiSuccess {Object} game
     * @apiSuccess {String} game.ip Ip of the game
     * @apiSuccess {Integer} game.port Port of the game
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          token: '1111-1111-1111-1111',
     *          game: {
     *              ip: '155.155.155.155',
     *              port: 8001
     *          }
     *      }
     */
    router.post('/:gameId/decide', (request, response, next) => {
        const gameId = request.params.gameId;

        gameManager
            .decide(gameId)
            .then(([token, game]) => response.send({
                token: token,
                game: {
                    ip: game.ip,
                    port: game.port
                }
            }))
            .catch(error => next(error));
    });

    return router;
};

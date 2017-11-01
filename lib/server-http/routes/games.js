const express = require('express');
const {check, validationResult} = require('express-validator/check');
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
     * @apiSuccess {String} token Authorization token
     * @apiSuccess {Object} game
     * @apiSuccess {Integer} game.id ID of the game
     * @apiSuccess {String} game.name Name of the game
     * @apiSuccess {String} game.ip IP of the game
     * @apiSuccess {Integer} game.port Port of the game
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          token: '1111-1111-1111-1111',
     *          game: {
     *              id: 1,
     *              name: 'Test',
     *              ip: '155.155.155.155',
     *              port: 8001
     *          }
     *      }
     */
    router.post('/',
        [check('name').isLength({min: 3})],
        (request, response, next) => {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(422).json({errors: errors.mapped()});
            }

            const gameName = request.body.name;

            gameManager
                .create(gameName)
                .then(game => gameManager.decide(game.id))
                .then(([token, game]) => response.send({
                    token: token,
                    game: transformGame(game)
                }))
                .catch(error => next(error));
        }
    );

    /**
     * @api {post} /games/:gameId/decision Decide to join the game
     * @apiVersion 0.0.1
     * @apiGroup Games
     *
     * @apiExample {json} Request:
     *      POST /games/1/decision
     *
     * @apiSuccess {String} token Authorization token
     * @apiSuccess {Object} game
     * @apiSuccess {Integer} game.id ID of the game
     * @apiSuccess {String} game.name Name of the game
     * @apiSuccess {String} game.ip IP of the game
     * @apiSuccess {Integer} game.port Port of the game
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          token: '1111-1111-1111-1111',
     *          game: {
     *              id: 1,
     *              name: 'Test',
     *              ip: '155.155.155.155',
     *              port: 8001
     *          }
     *      }
     */
    router.post('/:gameId/decision', (request, response, next) => {
        const gameId = request.params.gameId;

        gameManager
            .decide(gameId)
            .then(([token, game]) => response.send({
                token: token,
                game: transformGame(game)
            }))
            .catch(error => next(error));
    });

    return router;
};

const express = require('express');

module.exports = () => {
    const {gameManager} = include('/lib');
    const router = express.Router();

    router.get('/', (req, res) => {
        const games = gameManager
            .all()
            .map(game => ({
                    id: game.id,
                    name: game.name
                })
            );

        res.send(games);
    });

    router.post('/', (request, response, next) => {
        const gameName = request.body.name;

        gameManager
            .create(gameName)
            .then(game => response.send(game))
            .catch(error => next(error));
    });

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

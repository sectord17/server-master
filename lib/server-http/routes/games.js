const express = require('express');

module.exports = () => {
    const {gameManager} = include('/lib');
    const router = express.Router();

    router.get('/', (req, res) => {
        const games = gameManager.all().map(([id, name]) => ({id, name}));
        res.send(games);
    });

    // Create game
    router.post('/', (request, response, next) => {
        const gameName = request.body.name;

        gameManager
            .create(gameName)
            .then(game => response.send(game))
            .catch(error => next(error));
    });

    // Decide to join the game
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

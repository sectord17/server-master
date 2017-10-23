const debug = require('debug')('sectord17-master:game-manager');
const winston = require('winston');
const Game = require('./game');
const SlaveSDK = include('/lib/apis/slave-sdk');
const ModelNotFoundError = include('/lib/errors/model-not-found-error');

module.exports = exports = class GameManager {
    constructor() {
        this.games = new Map();
        this.gamesCounter = 0;
        this.slaveSDK = new SlaveSDK(process.env.SERVER_SLAVE_URL, process.env.SERVER_SLAVE_TOKEN);
    }

    /**
     * @returns {Array}
     */
    all() {
        return Array.from(this.games.values());
    }

    /**
     * @param {string} name
     * @returns {Promise.<Game>}
     */
    create(name) {
        const id = ++this.gamesCounter;

        return this.slaveSDK
            .createGame(id)
            .then(data => {
                const game = new Game(id, name, data.ip, data.port);
                this.games.set(game.id, game);

                debug(game);

                return game;
            });
    }

    /**
     * @param {int} gameId
     * @returns {Promise.<Game>}
     */
    shutdown(gameId) {
        return this.getGame(gameId)
            .then(game => Promise.all([game, this.slaveSDK.destroyGame(game.id)]))
            .then(([game]) => this.onShutdown(game));
    }

    /**
     * @param {Game} game
     */
    onShutdown(game) {
        this.games.delete(game.id);

        debug(game);
        winston.log('info', `Game ${game.getInlineDetails()} has shutdown`);

        return game;
    }

    /**
     *
     * @param {int} gameId
     * @returns {Promise.<[string, Game]>}
     */
    decide(gameId) {
        return this.getGame(gameId)
            .then(game => Promise.all([this.slaveSDK.decide(game.id), game]));
    }

    /**
     * @param {int} gameId
     * @returns {Promise.<Game>}
     * @private
     */
    getGame(gameId) {
        return new Promise((resolve, reject) => {
            const game = this.games.get(gameId);

            if (game) {
                return resolve(game);
            }

            return reject(new ModelNotFoundError('game', gameId));
        });
    }
};

const debug = require('debug')('sectord17-master:game-manager');
const Game = require('./game');
const SlaveSDK = include('/lib/apis/slave-sdk');
const ModelNotFoundError = include('/lib/errors/model-not-found-error');

module.exports = exports = class GameManager {
    constructor() {
        this.games = new Map();
        this.gamesCounter = 0;
        this.slave = new SlaveSDK(process.env.SERVER_SLAVE_URL, process.env.SERVER_SLAVE_TOKEN);
    }

    /**
     * @returns {Array}
     */
    all() {
        return Array.from(this.games.values());
    }

    create(name) {
        const id = ++this.gamesCounter;

        return this.slave
            .createGame(id)
            .then(data => {
                const game = new Game(id, name, data.ip, data.port);
                this.games.set(game.id, game);

                debug(game);

                return game;
            });
    }

    destroy(gameId) {
        return this._getGame(gameId)
            .then(game => Promise.all([game, this.slave.destroyGame(game.id)]))
            .then(([game]) => {
                this.games.delete(game.id);

                debug(game);

                return game;
            });
    }

    decide(gameId) {
        return this._getGame(gameId)
            .then(game => Promise.all([this.slave.decide(game.id), game]));
    }

    _getGame(gameId) {
        return new Promise((resolve, reject) => {
            const game = this.games.get(gameId);

            if (game) {
                return resolve(game);
            }

            return reject(new ModelNotFoundError("game"));
        });
    }
};

const debug = require('debug')('sectord17-master:game-manager');
const winston = require('winston');
const Game = require('./game');
const SlaveSDK = include('/lib/sdk/slave-sdk');
const ModelNotFoundError = include('/lib/errors/model-not-found-error');

module.exports = exports = class GameManager {
    constructor(slaveUrl, slaveToken) {
        /** @type {Map.<int, Game>} */
        this.games = new Map();
        this.gamesCounter = 0;
        this.slaveSDK = new SlaveSDK(slaveUrl, slaveToken);
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
            .createGame(id, name)
            .then(data => this.onCreate(id, name, data.ip, data.port));
    }

    /**
     * @param {int} id
     * @param {string} name
     * @param {string} ip
     * @param {int} port
     * @returns {Game}
     */
    onCreate(id, name, ip, port) {
        const game = new Game(id, name, ip, port);
        this.games.set(game.id, game);

        debug(game);

        return game;
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

    syncGames(games) {
        let dictionary = new Map();

        games.forEach(slaveGame => dictionary.set(slaveGame.id, slaveGame));

        // Remove
        this.all()
            .filter(game => !dictionary.has(game.id))
            .forEach(game => this.onShutdown(game));

        // Update
        this.games
            .forEach(game => game.playersCount = dictionary.get(game.id).players_count);

        // Create
        games
            .filter(slaveGame => !this.games.has(slaveGame.id))
            .forEach(({id, name, ip, port, players_count}) => {
                const game = this.onCreate(id, name, ip, port);
                game.setPlayersCount(players_count);
            });
    }
};

const winston = require('winston');
const reporter = require('../errors/reporter');

const GAMES_POOLING_INTERVAL = 5000;

module.exports = exports = class Supervisor {
    /**
     * @param {GameManager} gameManager
     */
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    watch() {
        setTimeout(this.fetchGames.bind(this), GAMES_POOLING_INTERVAL);
    }

    fetchGames() {
        this.gameManager.slaveSDK.listGames()
            .then(games => {
                this.gameManager.syncGames(games);
                setTimeout(this.fetchGames.bind(this), GAMES_POOLING_INTERVAL);
            })
            .catch(error => {
                reporter(error, false);
                winston.log('error', 'Slave is down');
                setTimeout(this.fetchGames.bind(this), GAMES_POOLING_INTERVAL);
            });
    }
};

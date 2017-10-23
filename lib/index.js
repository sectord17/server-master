global.include = function (file) {
    return require(__dirname + '/..' + file);
};

const ServerHTTP = require('./server-http');
const GameManager = require('./game-manager');

const gameManager = new GameManager();
const serverHTTP = new ServerHTTP(process.env.PORT);

module.exports = {
    gameManager,
    serverHTTP
};

require('./cli');
serverHTTP.start();
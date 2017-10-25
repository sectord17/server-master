const {getValidEnv, include} = require('./utils');

global.include = include;

const ServerHTTP = require('./server-http');
const GameManager = require('./game-manager');
const Supervisor = require('./supervisor');

const port = getValidEnv('PORT');
const slaveUrl = getValidEnv('SLAVE_URL');
const slaveToken = getValidEnv('SLAVE_TOKEN');

const gameManager = new GameManager(slaveUrl, slaveToken);
const serverHTTP = new ServerHTTP(port);
const supervisor = new Supervisor(gameManager);

module.exports = {
    gameManager,
    serverHTTP,
    supervisor
};

require('./cli');
supervisor.watch();
serverHTTP.start();

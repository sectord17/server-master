const {getValidEnv, include} = require('./utils');

global.include = include;

const ServerHTTP = require('./server-http');
const GameManager = require('./game-manager');
const MasterManager = require('./master-manager');
const Supervisor = require('./supervisor');

const port = getValidEnv('PORT');
const slaveUrl = getValidEnv('SLAVE_URL');
const slaveToken = getValidEnv('SLAVE_TOKEN');

const masterManager = new MasterManager(slaveU);
const gameManager = new GameManager(slaveUrl, slaveToken);
const serverHTTP = new ServerHTTP(port);
const supervisor = new Supervisor(gameManager);

module.exports = {
    gameManager,
    masterManager,
    serverHTTP,
    supervisor
};

require('./cli');
Promise.all([
    supervisor.watch(),
    serverHTTP.start()
])
    .then(() => masterManager.booted());

const readline = require('readline');
const {gameManager} = include('/lib');
const reporter = require('../errors/reporter');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    let args = input.split(' ');

    if (args.length < 1) {
        return;
    }

    try {
        if (args[0] === 'create') {
            return createGame(args);
        }

        if (args[0] === 'shutdown') {
            return destroyGame(args);
        }
    } catch (error) {
        reporter(error);
    }
});

const createGame = function (args) {
    if (args.length !== 2) {
        console.log("Usage: create name");
        return;
    }

    const gameName = args[1];

    gameManager.create(gameName)
        .then(game => console.log(`Game created ${game.getInlineDetails()}`))
        .catch(error => reporter(error));
};

const destroyGame = function (args) {
    if (args.length !== 2) {
        console.log("Usage: shutdown id");
        return;
    }

    const gameId = parseInt(args[1]);

    gameManager.shutdown(gameId)
        .then(game => console.log(`Game destroyed ${game.getInlineDetails()}`))
        .catch(error => reporter(error));
};

module.exports = rl;
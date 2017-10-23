const readline = require('readline');
const {gameManager} = include('/lib');

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
        console.log(error);
    }
});

const createGame = function (args) {
    if (args.length !== 2) {
        console.log("Usage: create name");
        return;
    }

    const gameName = args[1];

    gameManager.create(gameName)
        .then(game => console.log(`[INFO] Game created, ID: ${game.id}`))
        .catch(error => {
            if (error.message === "game-exists") {
                console.log("[ERROR] Game with such id already exists");
                return;
            }

            console.log(error)
        });
};

const destroyGame = function (args) {
    if (args.length !== 2) {
        console.log("Usage: shutdown id");
        return;
    }

    const gameId = parseInt(args[1]);

    gameManager.shutdown(gameId)
        .then(game => console.log(`[INFO] Game destroyed, ID: ${game.id}`))
        .catch(error => console.log(error));
};

module.exports = rl;
const readline = require('readline');
const {serverManager} = include('/lib');

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
            return createServer(args);
        }

        if (args[0] === 'destroy') {
            return destroyServer(args);
        }
    } catch (error) {
        console.log(error);
    }
});

const createServer = function (args) {
    if (args.length !== 2) {
        console.log("Usage: create name");
        return;
    }

    const serverName = args[1];

    serverManager.create(serverName)
        .then(server => console.log(`[INFO] Server created, ID: ${server.id}`))
        .catch(error => {
            if (error.message === "server-exists") {
                console.log("[ERROR] Server with such id already exists");
                return;
            }

            console.log(error)
        });
};

const destroyServer = function (args) {
    if (args.length !== 2) {
        console.log("Usage: destroy id");
        return;
    }

    const serverId = parseInt(args[1]);

    serverManager.destroy(serverId)
        .then(server => console.log(`[INFO] Server destroyed, ID: ${server.id}`))
        .catch(error => console.log(error));
};

module.exports = rl;
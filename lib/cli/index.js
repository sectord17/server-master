const readline = require('readline');

module.exports = function (serverManager) {
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
            if (args[0] === 'create-server') {
                return createServer(args);
            }

            if (args[0] === 'destroy-server') {
                return destroyServer(args);
            }
        } catch (error) {
            console.log(error);
        }
    });

    const createServer = function (args) {
        if (args.length !== 3) {
            console.log("Usage: create-server id name");
            return;
        }

        serverManager.create(args[1], args[2])
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
            console.log("Usage: destroy-server id");
            return;
        }

        serverManager.destroy(args[1])
            .then(server => console.log(`[INFO] Server destroyed, ID: ${server.id}`))
            .catch(error => console.log(error));
    };

    return rl;
};
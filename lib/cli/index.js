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

        if (args[0] === 'create-server') {
            if (args.length !== 3) {
                console.log("Usage: create-server id name");
                return;
            }

            serverManager.create(args[1], args[2]);
            return;
        }

        if (args[0] === 'destroy-server') {
            if (args.length !== 2) {
                console.log("Usage: destroy-server id");
                return;
            }

            serverManager.destroy(args[1]);
            return;
        }
    });

    return rl;
};
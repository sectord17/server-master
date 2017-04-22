module.exports = function(app) {
    const readline = require('readline');

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

            app.serverManager.create(args[1], args[2]);
            return;
        }

        if (args[0] === 'destroy-server') {
            if (args.length !== 2) {
                console.log("Usage: destroy-server id");
                return;
            }

            app.serverManager.destroy(args[1]);
            return;
        }
    });
};
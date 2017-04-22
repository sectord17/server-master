module.exports = function (app) {
    let express = require('express'),
        router = express.Router();

    router.get('/', function (req, res) {
        let servers = app.serverManager
            .all()
            .map(function (server) {
                return {
                    id: server.id,
                    name: server.name,
                };
            });

        res.send(servers);
    });

    return router;
};

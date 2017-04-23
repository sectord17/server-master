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

    router.post('/:serverId/join', function (request, response) {
        let serverId = request.params.serverId;

        app.serverManager.join(serverId, data => {
            response.send({
                token: data.token
            });
        }, () => {
            response.sendStatus(500);
        });
    });

    return router;
};

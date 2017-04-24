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

        app.serverManager.join(serverId)
            .then(data => {
                response.send({
                    token: data.token
                });
            })
            .catch(() => {
                response.sendStatus(500);
            });
    });

    return router;
};

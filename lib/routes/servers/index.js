module.exports = function (serverManager) {
    const express = require('express');
    const router = express.Router();

    router.get('/', function (req, res) {
        const servers = serverManager.all()
            .map(server => {
                return {
                    id: server.id,
                    name: server.name
                };
            });

        res.send(servers);
    });

    router.post('/:serverId/decide', function (request, response, next) {
        const serverId = request.params.serverId;

        serverManager.decide(serverId)
            .then(([token, server]) => response.send({
                token: token,
                server: {
                    ip: server.ip,
                    port: server.port
                }
            }))
            .catch(error => next(error));
    });

    return router;
};

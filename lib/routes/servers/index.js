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

    router.post('/:serverId/join', function (request, response) {
        const serverId = request.params.serverId;

        serverManager.join(serverId)
            .then(([token, server]) => response.send({
                token: token,
                server: {
                    ip: server.ip,
                    port: server.port
                }
            }))
            .catch((error) => {
                console.log(error);
                response.sendStatus(500)
            });
    });

    return router;
};

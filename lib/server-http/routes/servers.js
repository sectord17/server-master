const express = require('express');

module.exports = () => {
    const {serverManager} = include('/lib');
    const router = express.Router();

    router.get('/', (req, res) => {
        const servers = serverManager.all()
            .map(server => {
                return {
                    id: server.id,
                    name: server.name
                };
            });

        res.send(servers);
    });

    router.post('/', (request, response, next) => {
        const serverName = request.body.name;

        serverManager.create(serverName)
            .then(server => response.send(server))
            .catch(error => next(error));
    });

    router.post('/:serverId/decide', (request, response, next) => {
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

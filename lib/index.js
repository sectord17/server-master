module.exports = function (app) {
    app.serverManager = require('./server-manager')();

    require('./routes')(app);
    require('./cli')(app.serverManager);
};
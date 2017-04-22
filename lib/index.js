module.exports = function (app) {
    require('./routes')(app);
    app.serverManager = require('./server-manager')(app);
};
module.exports = function (app) {
    app.use('/', require('./homepage'));
    app.use('/admin', require('./admin')(app.serverManager));
    app.use('/servers', require('./servers')(app.serverManager));
};
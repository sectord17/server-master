module.exports = app => {
    app.use('/admin', require('./admin')());
    app.use('/games', require('./games')());
    app.use('/info', require('./info')());
};
const users = require('./users');
const messages = require('./messages');

module.exports = (router) => {
    users(router);
    messages(router);
    return router;
};
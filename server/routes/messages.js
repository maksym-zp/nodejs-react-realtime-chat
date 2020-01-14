const controller = require('../controllers/messages');
const {validateToken} = require('../utils');
const {messageOwner, canDelete} = require('../middleware/permissions');

module.exports = (router) => {
    router.route('/messages')
        .get(controller.all);
    router.route('/message/create')
        .post(validateToken, controller.create);
    router.route('/message/:id')
        .post(validateToken, messageOwner, controller.update);
    router.route('/message/:id')
        .delete(validateToken, canDelete, controller.delete);
};



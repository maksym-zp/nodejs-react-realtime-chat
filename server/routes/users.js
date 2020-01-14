const controller = require('../controllers/users');
const validateToken = require('../utils').validateToken;
const {validateLoginRequest} = require('../requests/ValidationLoginRequest');
const {validateEditRequest} = require('../requests/ValidateEditRequest');

module.exports = (router) => {
    router.route('/register')
        .post(controller.register);
    router.route('/login')
        .post(validateLoginRequest, controller.login);
    router.route('/user-data')
        .get(validateToken, controller.userData);
    router.route('/edit-user')
        .post(validateToken, validateEditRequest, controller.editUser);
    router.route('/preview-avatar')
        .post(controller.previewAvatar);
    router.route('/user/:id/save-avatar')
        .post(validateToken, controller.editAvatar);
    router.route('/users')
        .get(validateToken, controller.all);
};



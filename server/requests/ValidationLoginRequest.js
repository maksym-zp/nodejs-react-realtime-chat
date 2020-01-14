var Joi = require('joi');

module.exports = {
    validateLoginRequest: (req, res, next) => {
        const {body} = req;
        let loginForm = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
        });
        const result = Joi.validate(body, loginForm);
        const {error} = result;
        if(error && error.details) {
            let details = error.details;
            result.status = 404;
            result.error =  {errors: { [details[0].path[0]]: details[0].message}};
            res.status(404).send(result);
        } else {
            next();
        }
    }
};
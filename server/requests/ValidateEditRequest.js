var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
module.exports = {
    validateEditRequest: (req, res, next) => {
        const {body} = req;
        let loginForm = Joi.object({
            _id: Joi.objectId().required(),
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required()
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
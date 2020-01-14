const jwt = require('jsonwebtoken');
const { mongoDB, jwtToken } = require('./config');
const options = { expiresIn: jwtToken.expiresIn, issuer: jwtToken.issuer };
const secret = jwtToken.secret;

module.exports = {
    validateToken: (req, res, next) => {
        const authorizationHeaader = req.headers.authorization;
        let result;
        if (authorizationHeaader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            try {
                result = jwt.verify(token, secret, options);
                req.decoded = result;
                next();
            } catch (err) {
                throw new Error(err);
            }
        } else {
            result = {
                error: `Authentication error. Token required.`,
                status: 401
            };
            res.status(401).send(result);
        }
    },
    createToken: (user) => {
        const payload = { email: user.email };
        return  jwt.sign(payload, secret, options);
    },

    getMongoDBurl: (res) => {
        if (mongoDB && mongoDB.localUrl) {
            return mongoDB.localUrl;
        } else {
            let result = {
                error: {errors: {'credentials': 'Please configure the database connection first'}},
                status: 401
            };
            res.status(status).send(result);
        }
    },

    errorDbConnect: (res, err) => {
        let result = {
            status: 500,
            error: err,
        };
        res.status(status).send(result);
    }
};
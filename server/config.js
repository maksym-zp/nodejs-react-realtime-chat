module.exports = {
    development: {
        port: process.env.APP_PORT || 5000,
        saltingRounds: 10
    },
    mongoDB: {
        localUrl: process.env.MONGO_LOCAL_URL,
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_DATABASE,
    },
    jwtToken: {
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN || '2d',
        issuer: process.env.JWT_TOKEN_ISSUER || 'http://localhost',
        secret: process.env.JWT_TOKEN_SECRET || 'test_jwt_secret',
    }
};

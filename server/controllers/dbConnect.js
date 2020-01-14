const MongoClient = require('mongodb').MongoClient;
const {mongoDB} = require('../config');


let connection;


module.exports = {
    mongoInit: (collectionName) => {
        console.log(collectionName);
        return new Promise((resolve, reject) => {
            if (connection)
                resolve(connection);
            MongoClient.connect(mongoDB.dbHost, { useNewUrlParser: true }, (err, connect) => {
                if (err)
                    reject(err);
                connection = connect.db(mongoDB.dbName);
                resolve(connection)
            })
        })
    }
};
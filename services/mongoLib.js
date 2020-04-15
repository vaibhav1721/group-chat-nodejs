var Promise                                     = require('bluebird');
var MongoClient                                 = require('mongodb').MongoClient;

exports.initializeConnectionPool                = initializeConnectionPool;

function initializeConnectionPool(connectionConfig, mongoOptions) {
    return new Promise((resolve, reject) =>{
        MongoClient.connect(connectionConfig, mongoOptions, function (err, database) {
            if (err) {
                console.error("Mongo connection error", err);
                return reject(err);
            }
            // database = database.db('db_card_game');
            console.error(" ###################### Mongo connected ##################", typeof database, typeof database.db );
            return resolve(database);
        });
    });
}
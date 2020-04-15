
let config                                        = require('config');

exports.databaseSettings = {
    mongo : {
        connectionString : config.get('databaseSettings.mongo_db_connection')
    },
    // mysql : {
    //     master :{
    //       host              : config.get('databaseSettings.host'),
    //       user              : process.env.MYSQL_ROOT_USERNAME || config.get('databaseSettings.user'),
    //       password          : process.env.MYSQL_ROOT_PASSWORD || config.get('databaseSettings.password'),
    //       database          : config.get('databaseSettings.database'),
    //       multipleStatements: true
    //     }
    // }
};

exports.port            = process.env.PORT || config.get('PORT');

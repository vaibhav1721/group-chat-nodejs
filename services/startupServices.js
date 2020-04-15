const apiReferenceModule                          = "startup";

const Promise                                     = require('bluebird');
const envDetails                                  = require('./../properties/environmentDetails');
const http                                        = require('http');
const md5                                         = require('md5');
const constants                                   = require('../utills/constant');
const mongoLib                                    = require('../services/mongoLib');

exports.initializeServer                          = initializeServer;


function initializeServer() {
    return new Promise((resolve,reject)=>{
        let currentApi = {
            module : apiReferenceModule,
            api : 'initializeServer'
        }
        Promise.coroutine(function* () {
            db                  = yield mongoLib.initializeConnectionPool(envDetails.databaseSettings.mongo.connectionString);
            const server = yield startHttpServer(envDetails.port);
        })().then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    })
}

function startHttpServer(port) {
    return new Promise((resolve,reject) => {
        var server = http.createServer(app).listen(port, function (err, result) {
            if(err)
                reject(err);
            console.error("###################### Express connected ##################", port, app.get('env'));
            resolve(server);
        });
    });
}

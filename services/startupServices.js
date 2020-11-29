const apiReferenceModule                          = "startup";

const Promise                                     = require('bluebird');
const envDetails                                  = require('./../properties/environmentDetails');
const http                                        = require('http');
const md5                                         = require('md5');
const constants                                   = require('../utills/constant');
const mongoLib                                    = require('../services/mongoLib');
const mongoService                                = require('../services/mongoService');

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
            var io = require('socket.io').listen(server);

          io.configure(function() {
            io.set('transports', ['websocket']);
          });

          io.configure('production', function() {
            io.set('log level', 1);
          });

          io.sockets.on('connection', function(socket) {
            console.log("socket connected");
            socket.on('join', function(channel, ack) {
              socket.get('channel', function(err, oldChannel) {
                if (oldChannel) {
                  socket.leave(oldChannel);
                }
                socket.set('channel', channel, function() {
                  socket.join(channel);
                  ack();
                });
              });
            });

            socket.on('message', function(msg, ack) {
              socket.get('channel', async function(err, channel) {
                if (err) {
                  socket.emit('error', err);
                } else if (channel) {
                  await mongoService.mongoEdit("UPSERT DATA IN MONGO", {
                    collectionName : "tb_chats",
                    query : {
                      room_id : channel
                    },
                    updateData : {
                      room_id : channel,
                      last_message : msg
                    },
                    upsert : true
                  });
                  socket.broadcast.to(channel).emit('broadcast', msg);
                  ack();
                } else {
                  socket.emit('error', 'no channel');
                }
              });
            });
          });


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

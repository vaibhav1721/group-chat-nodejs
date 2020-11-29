let mongoLib                   = require('../../../services/mongoService');
let async                      = require('async');
let ObjectID                   = new require('mongodb').ObjectID;
let _                          = require('underscore');
let response                   = require('../../../utills/response');


exports.getRoomData            = getRoomData;

async function getRoomData(req, res) {
  let room_id = req.query.room_id;

  let room_data = await mongoLib.mongoFind("getRoomData", {
    collectionName: "tb_chats",
    findObj : {
      room_id: room_id
    }
  });
  if (_.isEmpty(room_data)) {
    res.send({statusCode: 404, data: []})
  } else {
    res.send({statusCode: 200, data: room_data})
  }
}
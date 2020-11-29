
var Joi                                         = require('joi');
var validator                                   = require('../../../validator/validator');

var apiReferenceModule                          = "chat";

exports.getRoomData                            = getRoomData;

function getRoomData(req,res,next){
    req.apiReference = {
        module: apiReferenceModule,
        api: "getRoomData"
    };
    var schema = Joi.object().keys({
        room_id         : Joi.string().required()
    });
    var validFields = validator.validateFields(req.apiReference, req.query, res, schema);
    if (validFields) {
        next();
    }
}
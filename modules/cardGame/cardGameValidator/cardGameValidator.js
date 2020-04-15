
var Joi                                         = require('joi');
var validator                                   = require('../../../validator/validator');

var apiReferenceModule                          = "cardGameModule";

exports.initiateGame                            = initiateGame;
exports.saveGameState                           = saveGameState;
exports.dealCard                                = dealCard;
exports.recordPlayerMoves                       = recordPlayerMoves;
exports.getPlayerHistory                        = getPlayerHistory;

function initiateGame(req,res,next){
    req.apiReference = {
        module: apiReferenceModule,
        api: "initiateGame"
    };
    var schema = Joi.object().keys({
        number_of_decks : Joi.number().required(),
        players         : Joi.number().required()
    });
    var validFields = validator.validateFields(req.apiReference, req.query, res, schema);
    if (validFields) {
        next();
    }
}

function saveGameState(req,res,next){
    req.apiReference = {
        module: apiReferenceModule,
        api: "saveGameState"
    };
    var schema = Joi.object().keys({
        playersId         : Joi.string().required(),
        playerName        : Joi.string().required(),
        playerCardData    : Joi.array().items({
            name: Joi.string().required(),
            suit: Joi.string().required(),
            value: Joi.string().required()
        })
    });
    var validFields = validator.validateFields(req.apiReference, req.body, res, schema);
    if (validFields) {
        next();
    }
}

function dealCard(req,res,next) {
    req.apiReference = {
        module: apiReferenceModule,
        api: "dealCard"
    };
    var schema = Joi.object().keys({
        deckData    : Joi.array().items({
            name    : Joi.string().required(),
            suit    : Joi.string().required(),
            value   : Joi.string().required()
        }),
        numberOfCards : Joi.number().required()
    });
    var validFields = validator.validateFields(req.apiReference, req.body, res, schema);
    if (validFields) {
        next();
    }
}

function recordPlayerMoves(req,res, next) {
    req.apiReference = {
        module: apiReferenceModule,
        api: "recordPlayerMoves"
    };
    var schema = Joi.object().keys({
        playersId         : Joi.string().required(),
        playerName        : Joi.string().required(),
        currentCardData    : {
            name    : Joi.string().required(),
            suit    : Joi.string().required(),
            value   : Joi.string().required()
        }
    });
    var validFields = validator.validateFields(req.apiReference, req.body, res, schema);
    if (validFields) {
        next();
    }
}

function getPlayerHistory(req,res,next){
    req.apiReference = {
        module: apiReferenceModule,
        api: "getPlayerHistory"
    };
    var schema = Joi.object().keys({
        playerId         : Joi.number().required()
    });
    var validFields = validator.validateFields(req.apiReference, req.query, res, schema);
    if (validFields) {
        next();
    }
}

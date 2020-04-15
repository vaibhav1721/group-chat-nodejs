let deck                       = require('./deckController');
let mongoLib                   = require('../../../services/mongoService');
let async                      = require('async');
let ObjectID                   = new require('mongodb').ObjectID;
let _                          = require('underscore');
let response                   = require('../../../utills/response');


exports.intiateGame            = intiateGame;
exports.saveGameState          = saveGameState;
exports.dealCard               = dealCard;
exports.recordPlayerMoves      = recordPlayerMoves;
exports.getPlayerHistory       = getPlayerHistory;

let deckArr = [];


async function intiateGame(req, res) {
    let insertArr = [];

    let cardArr = [];
    let numberOfDecks = req.query.number_of_decks;
    let numberOfPlayers = req.query.players;
    for(let i =0 ; i < numberOfDecks ; i++){
        let curr_deck = deck.generate_deck(deckArr);
        cardArr[i] = deck.shuffle(curr_deck);
    }
    let splitedArray = [];
    splitedArray=splitArr(cardArr[0], cardArr[0].length/numberOfPlayers);

    for(let i= 0 ; i < splitedArray.length ; i++) {
        let tempArray = splitedArray[i];
        let currPlayer = "Player" + i;
        let player = {
            player: currPlayer,
            card: tempArray
        }
        insertArr.push(player);
    }
    insertArr.map(async (player) =>{
        await mongoLib.mongoInsert(req.apiReference, {
            collectionName : config.get("mongoCollections.playersCardDetail"),
            insertObj: {playerData : player }
        })
    })
    res.send({splitedArray: splitedArray, insertArr : insertArr});
}

async function saveGameState(req, res) {
    let playersId      = req.body.playersId;
    let playerName     = req.body.playerName;
    let playerCardData = req.body.playerCardData;

    let validatePlayer = await mongoLib.mongoFind(req.apiReference, {
        collectionName : config.get("mongoCollections.playersCardDetail"),
        findObj: {
            _id : new ObjectID(playersId),
            "playerData.player" : playerName
        }
    })
    if(_.isEmpty(validatePlayer)){
        return response.invalidUser(res);
    }else{
        await mongoLib.mongoEdit(req.apiReference, {
            collectionName: config.get("mongoCollections.playersCardDetail"),
            query: {
                _id: new ObjectID(playersId)
            },
            updateData  : {
                "playerData.card" : playerCardData
            }
        });
        return response.sendResponse(res, "GAME STATE SAVED", 200);
    }
}

function dealCard(req, res) {
    let deckData = req.body.deckData;
    let numberOfCards = req.body.numberOfCards
    let dealtCards = deck.deal(deckData,numberOfCards)
    return response.sendResponse(res, "FINAL DECK ", 200, dealtCards);
}

async function recordPlayerMoves(req, res) {
    let playersId      = req.body.playersId;
    let playerName     = req.body.playerName;
    let currentCardData = req.body.currentCardData;

    let validatePlayer = await mongoLib.mongoFind(req.apiReference, {
        collectionName : config.get("mongoCollections.playersCardDetail"),
        findObj: {
            _id : new ObjectID(playersId),
            $and : [{
                "playerData.card" : { $in : [currentCardData]}
            }, {
                "playerData.player" : playerName,
            }]
        }
    })
    if(_.isEmpty(validatePlayer)){
        return response.invalidCard(res);
    }else {
        await mongoLib.mongoEdit(req.apiReference , {
            collectionName : config.get("mongoCollections.playersMovesHistory"),
            query: {
                _id: new ObjectID(playersId)
            },
            pushData : {
                moves : currentCardData
            },
            upsert : true
        })
        return response.sendResponse(res, "GAME STATE SAVED", 200);
    }
}

async function getPlayerHistory(req, res) {
    let playerId = req.query.playerId;
    let playerHistroyData = await mongoLib.mongoFind(req.apiReference, {
        collectionName : config.get("mongoCollections.playersMovesHistory"),
        findObj: {
            _id : new ObjectID(playerId),
        }
    })
    if(_.isEmpty(playerHistroyData)){
        response.sendResponse(res,"NO HISTROY AVAILABLE", 404,{})
    }else {
        response.sendResponse(res,"PLAYER HISTROY DATA :",200,playerHistroyData);
    }
}

function splitArr(array, n) {
    let [...arr]  = array;
    var res = [];
    while (arr.length) {
        res.push(arr.splice(0, n));
    }
    return res;
}
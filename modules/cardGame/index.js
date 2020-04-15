var cardGameValidator                    = require('./cardGameValidator/cardGameValidator');
var cardGameServices                     = require('./cardGameService/cardGameService');
var cardGameController                   = require('./cardGameController/cardGameController');


app.get('/initiate_game', cardGameValidator.initiateGame, cardGameController.intiateGame);
app.post('/save_game_state', cardGameValidator.saveGameState, cardGameController.saveGameState);
app.post('/deal_card' ,  cardGameValidator.dealCard, cardGameController.dealCard);
app.post('/save_player_moves', cardGameValidator.recordPlayerMoves, cardGameController.recordPlayerMoves);
app.get('/get_player_history' , cardGameValidator.getPlayerHistory, cardGameController.getPlayerHistory);


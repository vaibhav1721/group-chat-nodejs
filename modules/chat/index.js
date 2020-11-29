var chatValidator                    = require('./chatValidator/chatValidator');
var chatController                   = require('./chatController/chatController');


app.get('/get_room_data', chatValidator.getRoomData, chatController.getRoomData);
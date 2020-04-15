var md5 = require('md5');

const crptoService                            = require('../services/cryptoService');

exports.generateAccessToken                   = generateAccessToken;
exports.generateRandomString                  = generateRandomString;

function generateAccessToken(apiReference,email,password) {
   let stringToEncrypt = '';
    stringToEncrypt += apiReference+'.';

    if(email)
        stringToEncrypt += email;
    if(password)
        stringToEncrypt += password;

    stringToEncrypt += generateRandomString() + new Date().getTime();

    return crptoService.encrypt(stringToEncrypt);
}

function generateRandomString() {
    var text     = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

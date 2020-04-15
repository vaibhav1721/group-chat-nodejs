/*
* Created by Vaibhav Kaushik
* */
var crypto                      = require('crypto');


exports.encrypt                 = encrypt;
exports.decrypt                 = decrypt;


var algorithm                   = 'aes-128-cbc';
var secret_key                  = Buffer.from('5ebe2294ecd0e0f08eab7690d2a6ee69','hex');
var iv                          = Buffer.from('26ae5cc854e36b6bdfca366848dea6bb', 'hex');


function encrypt(text) {
    var cipher  = crypto.createCipheriv(algorithm, secret_key, iv);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    try {
        var decipher = crypto.createDecipheriv(algorithm, secret_key, iv);
        var dec      = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (e) {
        console.error("error in decrypt text: " + text);
        return undefined;
    }
}

#!/usr/bin/env node

var crypto = require('crypto');

function encrypt(text, algorithm, secret) {
    var cipher = crypto.createCipher(algorithm, secret);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text, algorithm, secret) {
    var decipher = crypto.createDecipher(algorithm, secret);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports = (text, algorithm, method, secret) => {
    if(method == 'encrypt') {
        return encrypt(text, algorithm, secret);
    } else if (method == 'decrypt') {
        return decrypt(text, algorithm, secret);
    } else {
        return null;
    }
};

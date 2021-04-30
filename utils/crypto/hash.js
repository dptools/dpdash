#!/usr/bin/env node
const crypto = require('crypto');

// Provided for key-based encryption. Don't use encrypt and decrypt for passwords!
function encrypt(text, algorithm, secret) {
  const iv = crypto.randomBytes(16);
  const secret32 = Buffer.concat([Buffer.from(secret), Buffer.alloc(32)], 32);
  const cipher = crypto.createCipheriv(algorithm, secret32, iv);
  let crypted = cipher.update(text);
  crypted = Buffer.concat([crypted, cipher.final()]);
  return iv.toString('hex') + ':' + crypted.toString('hex');
}

function decrypt(text, algorithm, secret) {
  const splitText = text.split(':');
  const iv = Buffer.from(splitText.shift(), 'hex');
  const encryptedText = Buffer.from(splitText.join(':'), 'hex');
  const secret32 = Buffer.concat([Buffer.from(secret), Buffer.alloc(32)], 32);
  const decipher = crypto.createDecipheriv(algorithm, secret32, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Use these for passwords.
function hash(text) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(text, salt, 2048, 32, 'sha512').toString('hex');
  return [salt, hash].join('$');
}

function verifyHash(text, original) {
  const originalHash = original.split('$')[1];
  const salt = original.split('$')[0];
  const hash = crypto.pbkdf2Sync(text, salt, 2048, 32, 'sha512').toString('hex');
  return hash === originalHash;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.hash = hash;
exports.verifyHash = verifyHash;
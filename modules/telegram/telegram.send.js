'use strict';

const _ = require('lodash');
const telegram = require('./telegram.rpc');

function sendText(rpc, userid, text, quickReplies) {
  console.log('hola 1');
  const msg = {
    chat_id: userid,
    text,
  };
  if (quickReplies) {
    _.assign(msg, {
      reply_markup: { inline_keyboard: [quickReplies] },
    });
  }
  return rpc('sendMessage', msg);
}

function quickReply(text, payload) {
  return {
    text,
    callback_data: JSON.stringify(payload),
  };
}

module.exports = { sendText, quickReply };

module.exports = (token) => {
  const rpc = telegram(token);
  return {
    quickReply,
    sendText: (...args) => sendText(rpc, ...args)
  };
}

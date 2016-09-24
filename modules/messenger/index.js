'use strict';

const Promise = require('bluebird');
const request = require('request');

module.exports = (token) => {
  const URI = `https://graph.facebook.com/v2.6/me/messages?access_token=${token}`;
  const api = {};

  function send(recipientId, payload, notifType = 'REGULAR') {
    const msg = {
      recipient: { id: recipientId },
      message: payload,
      notification_type: notifType,
    };
    return Promise.fromNode(callback => request(
      { uri: URI, method: 'POST', json: true, body: msg },
      callback));
  }

  api.sendText = (recipient, text, replies) => {
    const payload = { text };
    if (replies) {
      payload.quick_replies = replies;
    }
    return send(recipient, payload);
  };

  api.sendButtons = (recipient, text, buttons) => {
    const payload = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons,
        },
      },
    };
    return send(recipient, payload);
  };

  api.sendCards = (recipient, cards) => {
    const payload = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: cards,
        },
      },
    };
    return send(recipient, payload);
  };

  api.postbackButton = (title, payload) => ({
    type: 'postback',
    payload: JSON.stringify(payload),
    title,
  });

  api.linkButton = (title, url) => ({
    type: 'web_url',
    title,
    url,
  });

  api.quickReply = (title, payload) => ({
    content_type: 'text',
    payload: JSON.stringify(payload),
    title,
  });

  return api;
};


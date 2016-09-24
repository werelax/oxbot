'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

function assertEqual(a, b, msg = 'Does not match.') {
  if (a !== b) {
    throw new Error(msg);
  }
}

class WebhookService {
  constructor(verifyToken, messagingService) {
    this.messagingService = messagingService;
    this.verifyToken = verifyToken;
  }

  answerChallenge(params) {
    const mode = params['hub.mode'];
    const challenge = params['hub.challenge'];
    const token = params['hub.verify_token'];
    assertEqual(mode, 'subscribe', 'ERROR: Unknown mode');
    assertEqual(token, this.verifyToken, 'ERROR: Bad token');
    return Promise.resolve(challenge);
  }

  dispatchWebhook(payload) {
    const object = payload.object;
    const entries = payload.entry;
    assertEqual(object, 'page', 'ERROR: object must be "page"');
    return Promise.each(entries, e => this.dispatchEntry(e));
  }

  dispatchEntry(entry) {
    const { id, time } = entry;
    // we want the messages in the right sequence
    const messaging = _.sortBy(entry.messaging, 'message.seq');
    return Promise.each(
      messaging,
      msg => this.messagingService.dispatch(id, time, msg)
    );
  }
}

module.exports = WebhookService;

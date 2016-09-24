'use strict';

const Boom = require('boom');
const MessagingService = require('../messaging/messaging.service');
const WebhookService = require('./webhook.service');
// const commonErrors = require('../../base/errors');

const badImplementation = reply => (err) => {
  console.err('* ERROR:', err);
  reply(Boom.badImplementation());
};

module.exports = (path, verifyToken, db, queue) => {
  const messagingService = new MessagingService(queue);
  const webhookService = new WebhookService(verifyToken, messagingService);
  return [
    {
      method: 'GET',
      path: `${path}`,
      handler: (request, reply) => {
        const params = request.query;
        webhookService.answerChallenge(params)
          .then(reply)
          .catch(badImplementation(reply));
      },
    },
    {
      method: 'POST',
      path: `${path}`,
      handler: (request, reply) => {
        const payload = request.payload;
        webhookService.dispatchWebhook(payload);
        reply(200);
      },
    },
  ];
};

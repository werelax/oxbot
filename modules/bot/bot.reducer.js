'use strict';

const actionHandlers = require('./bot.actions.js');

module.exports = (state = {}, action, dispatch, tree, db) => {
  const handler = actionHandlers[action.type];
  return handler ? handler(state, action, dispatch, tree, db) : state;
};

'use strict';

const _ = require('lodash');
const decisionTree = require('../decisionTree');

function parse(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function dispatchToDecisionTree(tree, path, state, input, db) {
  return decisionTree
    .getNode(tree, path)
    .then(currentNode => decisionTree.advance(tree, currentNode, state, input,
                                              db))
    .then(nextNode => decisionTree.runNode(tree, nextNode, state, input, db));
}

module.exports = {
  BOT_POSTBACK_RECEIVED: (state, action, dispatch, tree, db) => {
    const { userid } = action;
    const { path } = state;
    const postback = action.payload.postback.payload;
    const input = {
      type: 'postback',
      value: parse(postback),
      action,
      dispatch,
      userid,
    };
    return dispatchToDecisionTree(tree, path, state, input, db);
  },
  BOT_INTERNAL_ACTION: (state, action, dispatch, tree, db) => {
    // TODO: do NOT interrupt an ongoing conversation
    const { userid } = action;
    const { path } = state;
    const input = {
      type: 'internal',
      value: action.payload,
      action,
      dispatch,
      userid,
    };
    return dispatchToDecisionTree(tree, path, state, input, db);
  },
  BOT_MESSAGE_RECEIVED: (state, action, dispatch, tree, db) => {
    // BUT: take into consideration the corner cases:
    //  a) first contact
    //  b) empty path
    //  c) very old path
    //  d) ???
    const { userid } = action;
    const { path } = state;
    const text = _.get(action, 'payload.text', null);
    const input = {
      type: 'message',
      /* eslint-disable */
      // value: quick_reply ? parse(_.get(quick_reply, 'payload')) : text,
      value: text,
      /* eslint-enable */
      action,
      dispatch,
      userid,
    };
    return dispatchToDecisionTree(tree, path, state, input, db);
  },
};

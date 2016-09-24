'use strict';

const _ = require('lodash');

const DEFAULT_PATH = 'start';
const SPECIAL_COMMANDS = ['link', '/reset'];

// -------------------------
// Commands

const commands = {
  link: (_params, input, state, currentNode, tree) => {
    const { path, params } = _params;
    const node = findNode(path, tree); // eslint-disable-line
    return _.assign({}, node, { params });
  },
  '/reset': (_params, input, state, currentNode, tree) =>
    findNode('RESET', tree), // eslint-disable-line
};

// -------------------------
// Utils

function findNode(path, tree) {
  return _.find(tree, { path }) || _.find(tree, { path: DEFAULT_PATH });
}

function isSpecialCommand(input) {
  const { value } = input;
  const command = _.get(value, 'command', false);
  return ((command && _.includes(SPECIAL_COMMANDS, command)) ||
          (typeof value === 'string' && _.includes(SPECIAL_COMMANDS, value)));
}

function runSpecialCommand(input, state, currentNode, tree) {
  const { command, params } = input.value;
  const handler = _.get(commands, command || input.value);
  return handler(params, input, state, currentNode, tree);
}

// -------------------------
// Command Builders

function link(path, params = {}) {
  return {
    command: 'link',
    params: {
      path,
      params,
    },
  };
}

function internalLink(path, userid, params = {}) {
  return {
    type: 'BOT_INTERNAL_ACTION',
    userid,
    payload: {
      command: 'link',
      params: {
        path,
        params,
      },
    },
  };
}

module.exports = {
  findNode,
  isSpecialCommand,
  runSpecialCommand,
  link,
  internalLink,
};

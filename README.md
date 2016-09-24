# TODO: write docs

# Some usage examples

From your `index.js`:

```javascript
const config = require('config');
const botox = require('./botox');
const treeNodes = require('./modules/tree');

botox
  .setup(config.bot)
  .then(({ treeSet, server, queue, db }) => {
    const token = config.bot.telegram.token;
    const chat = botox.telegram(token);
    const tree = treeNodes(chat);
    treeSet(tree);

    console.log('* ready to go!');
  })
  .catch(console.error);
```

From your `./modules/tree`:

```javascript
const _ = require('lodash');

module.exports = chat => _.concat(
  // simple demo bot
  require('./tree.fitbot')(chat),
  require('./tree.fitbot.s1')(chat),
  require('./tree.fitbot.s2')(chat),
  require('./tree.fitbot.s3')(chat)
);
```

From `./modules/tree/tree.fitbot`:

```javascript
module.exports = (chat) => {
  return [
    {
      path: 'START',
      run: ({ state, userid, value, db }) => {
        chat.sendText(userid, 'I\'m pretty dumb');
        return state;
      },
      advance: () => 'START',
    },

  ];
};
```

Good luck!


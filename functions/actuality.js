const fetch = require('node-fetch');
const { serverAddress } = require('../config');

module.exports = {
  name: 'actuality',
  async get() {
    // get actuality data
    return fetch(`${serverAddress}/api/getActuality`)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) {
          if (res.status === 404) throw new Error(json.error);
          throw new Error(json.error);
        }

        return json;
      })
      .catch(console.error);
  },
  async set(message, messageId, contentType = 'content') {
    // get user message
    return message.channel.messages
      .fetch({ around: messageId, limit: 1 })
      .then((messages) => {
        const actualityContent = messages.first().content;

        // send selected message to the server
        return fetch(`${serverAddress}/api/setActuality`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actuality: {
              [contentType]: actualityContent,
            },
          }),
        })
          .then(async (res) => {
            const json = await res.json();
            if (!res.ok) throw new Error(res.statusText);
            return json;
          });
      });
  },
};

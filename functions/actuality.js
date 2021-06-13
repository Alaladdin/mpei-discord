const fetch = require('node-fetch');
const { getActualityUrl, setActualityUrl } = require('../data/requests');

module.exports = {
  name: 'actuality',
  async get() {
    // get actuality data
    return fetch(getActualityUrl)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) throw new Error(json.error);

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
        return fetch(setActualityUrl, {
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

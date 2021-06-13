const fetch = require('node-fetch');
const { getFAQUrl, setFAQUrl, removeFAQUrl } = require('../data/requests');

module.exports = {
  name: 'FAQ',
  async get() {
    // get FAQ data
    return fetch(getFAQUrl)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) throw new Error(json.error);

        return json;
      })
      .catch(console.error);
  },
  async set(message, messageId) {
    // get user message
    return message.channel.messages
      .fetch({ around: messageId, limit: 1 })
      .then((messages) => {
        const FAQ = messages.first().content.split('\n');

        if (FAQ.length % 2 !== 0) throw new Error('Must be question-answer');

        const FAQObj = {
          question: FAQ[0],
          answer: FAQ[1],
        };

        // send selected message to the server
        return fetch(setFAQUrl, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ faq: FAQObj }),
        })
          .then(async (res) => {
            const json = await res.json();
            if (!res.ok) throw new Error(res.statusText);
            return json;
          });
      });
  },
  async delete(question) {
    return fetch(removeFAQUrl, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(res.statusText);
        return json;
      });
  },
};

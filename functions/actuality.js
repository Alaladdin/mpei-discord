const fetch = require('node-fetch');
const { getActualityUrl } = require('../data/requests');

module.exports = {
  name: 'actuality',
  async get() {
    return fetch(getActualityUrl)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok || !data.actuality) throw (data);

        return data.actuality;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  },
};

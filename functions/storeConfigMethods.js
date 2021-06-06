const fetch = require('node-fetch');
const { getConfigUrl, setConfigUrl } = require('../data/requests');

const getConfig = () => fetch(getConfigUrl)
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw new Error(res.statusText);

    return json.config;
  })
  .catch((err) => {
    console.error(err);
    return err;
  });

const setConfig = async (config) => fetch(setConfigUrl, {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ config }),
})
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw new Error(res.statusText);

    return json.config;
  });

module.exports = {
  getConfig,
  setConfig,
};

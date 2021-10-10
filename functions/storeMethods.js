const fetch = require('node-fetch');
const { getStoreUrl, setStoreUrl } = require('../data/requests');
const { authToken } = require('../config');

const getStore = () => fetch(getStoreUrl, { headers: { authToken } })
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw (json);

    return json.store;
  })
  .catch((err) => {
    console.error(err);
    return err;
  });

const setStore = async (store) => fetch(setStoreUrl, {
  method : 'post',
  headers: { 'Content-Type': 'application/json', authToken },
  body   : JSON.stringify({ store }),
})
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw (json);

    return json.store;
  });

module.exports = { getStore, setStore };

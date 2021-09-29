const { serverAddress } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getStoreUrl    : `${serverAddress}/dis/getStore`,
  setStoreUrl    : `${serverAddress}/dis/setStore`,
  getActualityUrl: `${serverAddress}/getActuality`,
  getScheduleUrl : `${serverAddress}/getSchedule`,
};

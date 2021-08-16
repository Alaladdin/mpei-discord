const { serverAddress, authToken } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getStoreUrl    : `${serverAddress}/getDiscordBotStore?authToken=${authToken}`,
  setStoreUrl    : `${serverAddress}/setDiscordBotStore?authToken=${authToken}`,
  getActualityUrl: `${serverAddress}/getActuality`,
  getScheduleUrl : `${serverAddress}/getSchedule`,
};

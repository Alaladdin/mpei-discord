const { serverAddress } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getStoreUrl    : `${serverAddress}/getDiscordBotStore`,
  setStoreUrl    : `${serverAddress}/setDiscordBotStore`,
  getActualityUrl: `${serverAddress}/getActuality`,
  getScheduleUrl : `${serverAddress}/getSchedule`,
};

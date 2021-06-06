const { serverAddress, authToken } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getConfigUrl: `${serverAddress}/getDiscordBotStore?authToken=${authToken}`,
  setConfigUrl: `${serverAddress}/setDiscordBotStore?authToken=${authToken}`,
  getActualityUrl: `${serverAddress}/getActuality`,
  setActualityUrl: `${serverAddress}/setActuality?authToken=${authToken}`,
  getScheduleUrl: `${serverAddress}/getSchedule/`,
};

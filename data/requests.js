const { serverAddress, authToken } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getConfigUrl: `${serverAddress}/getDiscordBotConfig?authToken=${authToken}`,
  setConfigUrl: `${serverAddress}/setDiscordBotConfig?authToken=${authToken}`,
  getActualityUrl: `${serverAddress}/getActuality`,
  setActualityUrl: `${serverAddress}/setActuality?authToken=${authToken}`,
  getScheduleUrl: `${serverAddress}/getSchedule/`,
};

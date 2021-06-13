const { serverAddress, authToken } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getStoreUrl: `${serverAddress}/getDiscordBotStore?authToken=${authToken}`,
  setStoreUrl: `${serverAddress}/setDiscordBotStore?authToken=${authToken}`,
  getActualityUrl: `${serverAddress}/getActuality`,
  setActualityUrl: `${serverAddress}/setActuality?authToken=${authToken}`,
  getScheduleUrl: `${serverAddress}/getSchedule/`,
  getFAQUrl: `${serverAddress}/getFAQ?authToken=${authToken}`,
  setFAQUrl: `${serverAddress}/addFAQ?authToken=${authToken}`,
  removeFAQUrl: `${serverAddress}/deleteFAQ?authToken=${authToken}`,
};

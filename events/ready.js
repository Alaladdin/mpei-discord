const activities = require('../data/actvities');
const { isProd } = require('../config');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    await client.user.setPresence({
      activity: isProd ? activities.default : activities.developing,
      status: 'dnd',
    });
    console.log(`Logged in as ${client.user.tag}`);
  },
};

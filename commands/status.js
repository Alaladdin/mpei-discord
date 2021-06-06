const fetch = require('node-fetch');
const { version } = require('../package.json');
const { serverAddress, prefix, isProd } = require('../config');
const { getUniversalUrl } = require('../data/requests');

module.exports = {
  name: 'status',
  description: 'Выводит информацию о боте',
  aliases: ['info', 'i'],
  async execute(message) {
    const msg = [];
    const serverData = (query) => fetch(getUniversalUrl(query))
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(res.statusText);
        return Object.values(json)[0];
      })
      .catch((err) => {
        console.error(err);
        return 'error';
      });

    // bot info
    msg.push('```');

    msg.push('- Bot info');
    msg.push(`· version: ${version}`);
    msg.push(`· prefix: "${prefix}"`);
    msg.push(`· isProduction: ${isProd}`);

    // server info
    msg.push('\n- Server info');
    msg.push(`· address: ${serverAddress}`);
    msg.push(`· version: ${await serverData('version')}`);
    msg.push(`· health: ${await serverData('health')}`);
    msg.push(`· ping: ${await serverData('ping')}`);

    msg.push('```');

    return message.channel.send(msg, { split: true });
  },
};

const fs = require('fs');

const commands = new Map();
const commandFolders = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

module.exports = {
  name       : 'commands',
  description: 'get bot commands',
  init(client) {
    commandFolders.forEach(async (file) => {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const command = require(`../commands/${file}`);

      commands.set(command.name, command);
      await client.commands.set(command.name, command);
    });
  },
};

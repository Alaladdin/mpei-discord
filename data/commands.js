const fs = require('fs');

module.exports = {
  name       : 'commands',
  description: 'get bot commands',
  init(client) {
    const commandFolders = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

    commandFolders.forEach(async (file) => {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const command = require(`../commands/${file}`);

      await client.commands.set(command.name, command);
    });
  },
};

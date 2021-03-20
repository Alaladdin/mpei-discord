const fs = require('fs');

const commands = new Map();
const commandFolders = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

module.exports = {
  name: 'commands',
  description: 'get bot commands',
  init(client) {
    commandFolders.forEach((file) => {
      const command = require(`../commands/${file}`);

      commands.set(command.name, command);
      client.commands.set(command.name, command);
    });
  },
};

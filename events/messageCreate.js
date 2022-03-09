const { prefix } = require('../config');
const { getCommand } = require('../helpers');

module.exports = {
  name: 'messageCreate',
  execute(msg, client) {
    if (!msg.content.startsWith(prefix) || msg.content.length <= 1 || msg.author.bot) return;

    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(' ').filter((arg) => arg);
    const commandName = args.shift().toLowerCase();
    const command = getCommand(client.commands, commandName);

    // call command
    if (command) command.execute(msg, args);
  },
};

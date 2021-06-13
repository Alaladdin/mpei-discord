const { blacklist } = require('../data/rights');
const { prefix } = require('../config');

module.exports = {
  name: 'message',
  execute(msg, client) {
    const blacklistedIds = blacklist().map((user) => user.id);
    if (
      !msg.content.startsWith(prefix)
      || msg.author.bot
      || blacklistedIds.includes(msg.author.id)
    ) {
      return;
    }

    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(' ').filter((arg) => arg);
    const commandName = args.shift().toLowerCase();

    // get command by name or alias
    const command = client.commands.get(commandName)
      || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    // call command
    if (command) command.execute(msg, args);
  },
};

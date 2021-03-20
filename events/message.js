const { prefix } = require('../config');

module.exports = {
  name: 'message',
  execute(msg, client) {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const commandName = args.shift().toLowerCase();

    // get command by name or alias
    const command = client.commands.get(commandName)
      || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    // call command
    if (command) command.execute(msg, args);
  },
};

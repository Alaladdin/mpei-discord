const { prefix } = require('../config');

module.exports = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'Получает список доступных пользователю команд',
  arguments: [
    {
      name: '[command]',
      description: 'информация об определенной команде',
    },
  ],
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      const userAllowedCommands = commands.filter((command) => {
        if (message.guild) {
          const member = message.guild.member(message.author);
          return member.permissions.has(command.permissions);
        }

        return !command.permissions;
      });

      data.push('Список моих командуcов:');
      data.push(userAllowedCommands.map((command) => `\`${command.name}\` - ${command.description}`)
        .join('\n'));
      data.push(`\nОтправь мне \`${prefix}help [название команды]\`, чтобы получить информацию по определенной команде`);

      message.channel.send(data, { split: true });
      return;
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(
      (c) => c.aliases && c.aliases.includes(name),
    );

    if (!command) {
      message.reply('я не нашел эту команду в своем крутейшем списке');
      return;
    }

    data.push(`**Name:** ${command.name}`);
    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.aliases) data.push(`**Aliases:** \`${command.aliases.join('`, `')}\``);

    if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

    // command arguments
    if (command.arguments) {
      const commandArgs = [];
      Object.values(command.arguments).forEach((c) => {
        commandArgs.push(`\`${c.name}\` - ${c.description}`);
        if (c.permissions) commandArgs.push(`Права: \`[${c.permissions.join(', ')}]\`\n`);
      });
      data.push(`**Arguments:** \n${commandArgs.join('\n')}`);
    }

    // we cannot check roles wo server -> send data
    // command roles
    if (command.permissions) {
      const permissions = [];
      command.permissions.forEach((p) => permissions.push(p));
      data.push(`**Permissions:** \`[${permissions.join(', ')}]\``);
    }

    // send data
    message.channel.send(data, { split: true });
  },
};

const { prefix } = require('../config');
const roleById = require('../utility/roleById');
const allowedCommands = require('../utility/allowedCommands');

module.exports = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'Получаем информацию о командах',
  usage: '[command]',

  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!message.guild) {
      message.reply('команда должна быть вызвана с сервера');
      return;
    }

    if (!args.length) {
      const userAllowedCommands = allowedCommands.get(
        message.guild.member(message.author),
        commands,
      );

      data.push('Список моих командуcов:');
      data.push(userAllowedCommands.map((command) => `\`${command.name}\``).join('\n'));
      data.push(`\nТы можешь отправить мне \`${prefix}help [название команды]\`, чтобы получить информацию по определенной команде`);

      return message.channel.send(data, { split: true });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(
      (c) => c.aliases && c.aliases.includes(name),
    );

    if (!command) return message.reply('я не нашел эту команду в своем крутейшем списке');

    data.push(`**Name:** ${command.name}`);

    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
    if (command.roles) {
      const roleNames = [];
      command.roles.forEach((role) => roleNames.push(roleById.get(message, role).name));
      data.push(`**Required role:** ${roleNames.join(', ')}`);
    }

    return message.channel.send(data, { split: true });
  },
};

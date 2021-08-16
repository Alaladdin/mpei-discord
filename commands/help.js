const { prefix } = require('../config');
const colors = require('../data/colors');
const {
  capitalize, getCommand, getRandomArrayItem, checkPermissions,
} = require('../helpers');

module.exports = {
  name       : 'help',
  aliases    : ['h', 'commands'],
  description: 'Получает список доступных пользователю команд',
  arguments  : [{
    name       : '[command]',
    description: 'информация об определенной команде',
  }],
  getAllCommandsInfo(message) {
    const embedCommandsList = [];
    const userAllowedCommands = message.client.commands.filter(
      (c) => c.permissions === undefined || checkPermissions(message, c.permissions),
    );

    userAllowedCommands.forEach((command) => embedCommandsList.push({
      name : `${prefix}${command.name}`,
      value: command.description,
    }));

    const commandsEmbed = {
      color : getRandomArrayItem(colors),
      title : 'Список моих командуcов',
      fields: embedCommandsList,
      footer: {
        text: `Отправь мне ${prefix}help [команда], чтобы получить информацию по команде`,
      },
    };

    return message.channel.send({ embeds: [commandsEmbed] });
  },
  getCommandInfo(message, command) {
    const embedCommandsList = [{
      name : 'Описание',
      value: command.description,
    }];

    if (command.aliases) {
      embedCommandsList.push({
        name : 'Алиасы',
        value: command.aliases.map((c) => `\`${c}\``)
          .join(', '),
      });
    }

    if (command.arguments) {
      const commandArgs = [];

      Object.values(command.arguments)
        .forEach((c) => {
          const arg = [];

          arg.push(`\`${c.name}\` - ${c.description}`);
          if (c.permissions) arg.push(`Права: \`[${c.permissions.join(', ')}]\``);

          commandArgs.push(arg.join('\n'));
        });

      embedCommandsList.push({
        name  : 'Аргументы',
        value : commandArgs.join('\n'),
        inline: true,
      });
    }

    if (command.permissions) {
      embedCommandsList.push({
        name : 'Права',
        value: command.permissions.map((p) => `\`${p}\``)
          .join(', '),
      });
    }

    const commandsEmbed = {
      color : getRandomArrayItem(colors),
      title : `Команда: ${capitalize(command.name)}`,
      fields: embedCommandsList,
    };

    return message.channel.send({ embeds: [commandsEmbed] });
  },
  execute(message, args) {
    const { commands } = message.client;

    if (!args.length) return this.getAllCommandsInfo(message);

    const command = getCommand(commands, args[0]);

    if (command) return this.getCommandInfo(message, command);

    return message.reply('Я не нашел эту команду в своем крутейшем списке');
  },
};

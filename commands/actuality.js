const permissions = require('../utility/permissions');
const pdate = require('../utility/pdate');
const { random, accessError } = require('../data/phrases');
const { get: getActuality, set: setActuality } = require('../functions/actuality');

module.exports = {
  name: 'actuality',
  description: 'Выводит "актуалочку"',
  aliases: ['a', 'act', 'news', 'акт'],
  arguments: {
    set: {
      name: 'set',
      description: 'обновляет данные актуалочки',
      permissions: ['ADMINISTRATOR'],
    },
    watch: {
      name: 'watch',
      description: 'следит за изменениями актуалочки и обновляет данные сам',
      permissions: ['ADMINISTRATOR'],
    },
  },
  async execute(message, args) {
    const [command, messageId] = args;

    // if arguments not passed -> get actuality list
    if (!args.length) {
      message.channel.send('`Получаю данные с сервера...`')
        .then(async (sentMessage) => {
          const { actuality } = await getActuality() || {};
          const msg = [];

          if (actuality && 'content' in actuality) {
            msg.push('```');
            msg.push(`Актуалити. Обновлено: ${pdate.format(actuality.date, 'ru-RU')}\n`);
            msg.push(actuality.content);
            msg.push('```');
          } else {
            msg.push('Непредвиденская ошибка сервера 😔');
          }

          sentMessage.edit(msg.join('\n'));
        });

      return;
    }

    // actuality commands set up
    if (command !== 'set') {
      message.reply(`не знаю, что за аргумент такой \`${command}\``);
      return;
    }

    // Если id не передано
    if (!messageId || (messageId && messageId.length <= 0)) {
      message.reply('Необходимо указать `id` сообщения');
      return;
    }

    // check user permission to this command
    const hasPermission = permissions.check(message, this.arguments.set.permissions);

    // if no permission -> break
    if (!hasPermission) {
      message.reply(random(accessError));
      return;
    }

    // else -> set new actuality
    await setActuality(message, messageId)
      .then(({ actuality } = {}) => {
        if (actuality && 'content' in actuality) {
          message.reply('похоже, актуалочка успешно обновлена 🔥');
        } else {
          message.reply('не удалось обновить актуалочку 😔');
        }
      });
  },
};

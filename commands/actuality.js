const moment = require('moment');
const { defaultDateFormat } = require('../config');
const permissions = require('../util/permissions');
const { random, accessError } = require('../data/phrases');
const { getters: storeGetter, setters: storeSetter } = require('../store/index');
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
    au: {
      name: 'autoposting',
      description: 'обновляет настройки автопостинга',
      permissions: ['ADMINISTRATOR'],
    },
    lazy: {
      name: 'lazy',
      description: 'получает "несрочную" актуалочку',
    },
  },
  async execute(message, args) {
    const [command, arg1, arg2] = args;

    // if arguments not passed -> get actuality list
    if (!args.length || command === 'lazy') {
      message.channel.send('`Получаю данные с сервера...`')
        .then(async (sentMessage) => {
          const { actuality } = await getActuality() || {};
          const msg = [];

          if (actuality && 'content' in actuality) {
            msg.push('```');

            if (command === 'lazy') {
              msg.push('Несрочное актуалити\n');
              msg.push(actuality.lazyContent);
            } else {
              msg.push(`Актуалити. Обновлено: ${moment(actuality.date)
                .format(defaultDateFormat)}\n`);
              msg.push(actuality.content);
            }

            msg.push('```');
          } else {
            msg.push('Непредвиденская ошибка сервера 😔');
          }

          sentMessage.edit(msg.join('\n'));
        });

      return;
    }

    // actuality commands set up
    if (!Object.keys(this.arguments).includes(command)) {
      message.reply(`не знаю, что за аргумент такой \`${command}\``);
      return;
    }

    // check user permission to this command
    const hasPermission = permissions.check(message, this.arguments[command].permissions);

    // if no permission -> break
    if (!hasPermission) {
      message.reply(random(accessError));
      return;
    }

    // autopost
    if (command === 'au') {
      const currChannelId = storeGetter.getActualityChannel();
      const currChannel = await message.guild.channels.cache.get(currChannelId);

      // for example: arg1 = 'channel', arg2 = 'channelId'
      if (!arg1 && !arg2) {
        const msg = [];
        msg.push('**Текущие настройки автопостинга**\n');
        msg.push(`**Канал:** ${(currChannel && currChannel.toString()) || 'не установлен'}`);
        msg.push(`**Время:** \`${storeGetter.getActualityTime() || '* * * * * *'}\``);
        await message.channel.send(msg, { split: true });
        return;
      }

      // if unknown arguments were passed
      if (!['channel', 'time'].includes(arg1)) {
        message.reply(`не знаю, что за аргумент такой \`${arg1}\``);
        return;
      }

      // if arguments were passed, but arg2 is empty
      if (['channel', 'time'].includes(arg1) && !arg2) {
        message.reply(`необходимо указать \`${arg1 === 'channel' ? 'id канала' : 'время отправки'}\``);
        return;
      }

      // if channel
      if (arg1 === 'channel') {
        const newChannel = await message.guild.channels.cache.get(arg2);

        if (!newChannel) {
          message.reply('канал с таким `id` не найден');
          return;
        }

        await storeSetter.setActualityChannel(arg2)
          .then(() => {
            message.reply(`канал для автопостинга актуалочки изменен${currChannelId ? ` с ${currChannel.toString()}` : ''} на ${newChannel.toString()}`);
          })
          .catch((err) => {
            message.reply(`ошибка при попытке изменить канал для автопостинга актуалочки в базе данных\n\n\`${err.statusText}\``);
          });
        return;
      }

      // if time
      if (arg1 === 'time') {
        const currTime = storeGetter.getActualityTime();
        const symbolsValidation = (arr) => arr.join(' ')
          .replaceAll(/[^0-9|?* ]/gm, '')
          .split(' ')
          .filter((item) => item)
          .join(' ');

        const newTime = symbolsValidation(args.splice(2));

        await storeSetter.setActualityTime(newTime)
          .then(() => {
            message.reply(`время автопостинга актуалочки изменено ${currTime ? `с \`${currTime}\`` : ''} на \`${newTime}\``);
          })
          .catch((err) => {
            message.reply(`ошибка при попытке изменить время автопостинга актуалочки в базе данных\n\n\`${err.statusText}\``);
          });
        return;
      }
    }

    // set actuality
    if (command === 'set') {
      // Если id не передано
      if (!arg1 || (arg1 && arg1.length <= 0)) {
        message.reply('Необходимо указать `id` сообщения');
        return;
      }

      const contentType = arg1.toLowerCase() === 'lazy' ? 'lazyContent' : 'content';
      const isContent = contentType === 'content';
      const messageId = isContent ? arg1 : arg2;

      // else -> set new actuality
      await setActuality(message, messageId, contentType)
        .then(() => message.reply(`${!isContent ? 'несрочная ' : ''}актуалочка успешно обновлена 🔥`))
        .catch((err) => {
          console.error(err);
          message.reply('не удалось обновить актуалочку 😔');
        });
    }
  },
};

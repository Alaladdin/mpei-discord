const fetch = require('node-fetch');
const permissions = require('../utility/permissions');
const pdate = require('../utility/pdate');
const { random, accessError } = require('../data/phrases');
const { serverAddress } = require('../config');

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
      message.channel.send('Получаю данные с сервера')
        .then(async (sentMessage) => {
          const { actuality } = await this.get(message) || {};
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

    // check user permission to this command
    const hasPermission = permissions.check(message, this.arguments.set.permissions);

    // if no permission -> break
    if (!hasPermission) {
      message.reply(random(accessError));
      return;
    }

    // else -> set new actuality
    await this.set(message, messageId)
      .then(({ actuality } = {}) => {
        if (actuality && 'content' in actuality) {
          message.reply('похоже, актуалочка успешно обновлена 🎉');
        } else {
          message.reply('не удалось обновить актуалочку 😔');
        }
      });
  },
  async get(message) {
    // get actuality data
    return fetch(`${serverAddress}/api/getActuality`)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) {
          if (res.status === 404) return message.reply(json.error);
          throw new Error(json.error);
        }
        return json;
      })
      .catch(console.error);
  },
  async set(message, messageId) {
    // get user message first
    return message.channel.messages
      .fetch({ around: messageId, limit: 1 })
      .then((messages) => {
        const actuality = messages.first().content;

        // send selected message to the server
        return fetch(`${serverAddress}/api/setActuality`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actuality }),
        })
          .then(async (res) => {
            const json = await res.json();
            if (!res.ok) throw new Error(res.statusText);
            return json;
          });
      })
      .catch(console.error);
  },
};

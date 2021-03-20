const fetch = require('node-fetch');
const permissions = require('../utility/permissions');
const { admin, headman } = require('../data/roles');
const { serverAddress } = require('../config');

module.exports = {
  name: 'actuality',
  description: 'Получает "актуалочку"',
  // usage: {
  //   everyone: '',
  //   admin: '',
  //   mod: '',
  // }
  aliases: ['a', 'act', 'news', 'акт'],
  hiddenRoles: {
    set: [admin, headman],
  },
  async execute(message, args) {
    // if arguments not passed -> get actuality list
    if (!args.length) {
      const { actuality } = await this.get(message) || {};

      // if actuality data exists
      if (actuality && 'content' in actuality) {
        message.channel.send(actuality.content);
      } else {
        message.reply('непредвиденская ошибка. Кто-то украл данные из БД');
      }
      return;
    }

    // actuality commands set up
    const [command, messageId] = args;
    if (command !== 'set') {
      message.reply(`не знаю, что за команда такая "${command}"`);
      return;
    }

    // check user permission to this command
    const hasPermission = permissions.check(
      message.guild.member(message.author),
      this.hiddenRoles.set,
    );

    // if no permission -> break
    if (!hasPermission) {
      message.reply('у тебя недостаточно прав для таких приколов');
      return;
    }

    // else -> set new actuality
    this.set(message, messageId);
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
      .catch((err) => {
        console.error(err);
        message.reply('ошибка при попытке получить актуалочку');
      });
  },
  set(message, messageId) {
    try {
      // get user message first
      message.channel.messages
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
              if (!res.ok) throw new Error('fetch error');
              message.reply('похоже, актуалочка успешно обновлена');
              return json;
            });
        })
        .catch((err) => {
          console.error(err);
          message.reply('при попытке обновления актуалочки возникла ошибка');
        });
    } catch (err) {
      message.channel.send('Какая-то непредвиденнская ошибка');
    }
  },
};

const fetch = require('node-fetch');
const permissions = require('../utility/permissions');
const { admin, headman } = require('../data/roles');
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
      roles: [admin, headman],
    },
    watch: {
      name: 'watch',
      description: 'следит за изменениями актуалочки и обновляет данные сам',
      roles: [admin, headman],
    },
  },
  async execute(message, args) {
    const [command, messageId] = args;

    // if arguments not passed -> get actuality list
    if (!args.length) {
      message.channel.send('Получаю данные с сервера')
        .then(async (sentMessage) => {
          const { actuality } = await this.get(message) || {};
          sentMessage.edit((actuality && 'content' in actuality)
            ? `\`\`\`${actuality.content}\`\`\``
            : 'Непредвиденская ошибка. Кто-то украл данные из БД');
        });

      return;
    }

    // actuality commands set up
    if (command !== 'set') {
      message.reply(`не знаю, что за аргумент такой \`${command}\``);
      return;
    }

    // check user permission to this command
    const user = message.guild ? message.guild.member(message.author) : message.author;
    const hasPermission = permissions.check(user, this.arguments.set.roles);

    // if no permission -> break
    if (!hasPermission) {
      message.reply(random(accessError));
      return;
    }

    // else -> set new actuality
    await this.set(message, messageId);
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

const permissions = require('../util/permissions');
const { random, accessError } = require('../data/phrases');
const { get: getFAQ, add: addFAQ, delete: deleteFAQ } = require('../functions/FAQ');

module.exports = {
  name: 'faq',
  description: 'Выводит FAQ',
  aliases: ['f', 'qa'],
  arguments: {
    add: {
      name: 'add',
      description: 'обновляет FAQ',
      permissions: ['ADMINISTRATOR'],
    },
    rm: {
      name: 'rm',
      description: 'удаляет пункт из FAQ',
      permissions: ['ADMINISTRATOR'],
    },
  },
  async execute(message, args) {
    const [command, arg1] = args;

    // if arguments not passed -> get FAQ list
    if (!args.length) {
      message.channel.send('`Получаю данные с сервера...`')
        .then(async (sentMessage) => {
          const { faq } = await getFAQ() || {};
          const msg = [];

          if (faq && faq.length) {
            msg.push('```');
            msg.push('FAQ\n');
            faq.forEach((item) => {
              msg.push(item.question, `${item.answer}\n`);
            });
            msg.push('```');
          } else if (faq && !faq.length) {
            msg.push('FAQ пустой 😔');
          } else {
            msg.push('Непредвиденская ошибка сервера 😔');
          }

          sentMessage.edit(msg.join('\n'));
        });

      return;
    }

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

    // add question to FAQ
    if (command === 'add') {
      // Если id не передано
      if (!arg1 || (arg1 && arg1.length <= 0)) {
        message.reply('Необходимо указать `id` сообщения');
        return;
      }

      // else -> set new actuality
      await addFAQ(message, arg1)
        .then(() => message.reply('вопрос успешно добавлен 🔥'))
        .catch((err) => {
          console.error(err);
          const errorText = err.code === 'ECONNREFUSED' ? 'Error: connection error' : err.message;
          message.reply(`не удалось добавить вопрос в FAQ 😔 \n\`${errorText || ''}\``);
        });
    }
    if (command === 'rm') {
      // Если id не передано
      const question = args.splice(1).join(' ').trim();

      if (!question) {
        message.reply('Необходимо указать "question" для удаления');
        return;
      }

      await deleteFAQ(question)
        .then(() => message.reply('вопрос успешно удален из FAQ 🔥'))
        .catch((err) => {
          console.error(err);
          const errorText = err.code === 'ECONNREFUSED' ? 'Error: connection error' : err.message;
          message.reply(`не удалось удалить вопрос 😔 \n\`${errorText || ''}\``);
        });
    }
  },
};

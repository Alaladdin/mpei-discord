const permissions = require('../util/permissions');
const { random, accessError } = require('../data/phrases');

module.exports = {
  name: 'clear',
  description: 'Удаляет указанное количество сообщений (2-99)',
  usage: '[count]',
  permissions: ['ADMINISTRATOR'],
  async execute(message, args) {
    if (!message.guild) {
      message.channel.send('Команда не для личных сообщений');
      return;
    }

    // if has no permission -> return
    const hasPermission = permissions.check(message, this.permissions);

    if (!hasPermission) {
      message.reply(random(accessError));
      return;
    }

    // if no count set
    if (!args[0]) {
      message.reply('необходимо указать количество сообщений для удаления');
      return;
    }

    const deleteCount = parseInt(args[0], 10);

    // if count is not valid
    if (deleteCount < 2 || deleteCount > 99) {
      message.reply('количество сообщений для удаления должно быть больше одного и меньше ста');
      return;
    }

    const fetched = await message.channel.messages.fetch({ limit: deleteCount + 1 });

    try {
      await message.channel.bulkDelete(fetched, true)
        .then(() => message.channel.send(`Удалено сообщений: ${deleteCount}`));
    } catch (err) {
      console.error(err);
      message.channel.send('Ошибка при удалении сообщений');
    }
  },
};

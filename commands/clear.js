const { checkPermissions, getRandomArrayItem } = require('../helpers');
const { accessError } = require('../data/phrases');

module.exports = {
  name       : 'clear',
  description: 'Удаляет указанное количество сообщений [2-99]',
  permissions: ['ADMINISTRATOR'],
  async execute(message, args) {
    if (!message.guild) return message.channel.send('Команда не для личных сообщений');

    const hasPermission = checkPermissions(message, this.permissions);

    if (!hasPermission) return message.reply(getRandomArrayItem(accessError));
    if (!args[0]) return message.reply('Необходимо указать количество сообщений для удаления');

    const providedDeleteCount = parseInt(args[0], 10);

    if (providedDeleteCount < 2) return message.reply('Количество сообщений для удаления должно быть не меньше 2');

    try {
      const deleteCount = providedDeleteCount > 99 ? 100 : providedDeleteCount + 1;
      const fetchedMessages = await message.channel.messages.fetch({ limit: deleteCount });
      await message.channel.bulkDelete(fetchedMessages, true);

      return message.channel.send(`Удалено сообщений: ${deleteCount - 1}`);
    } catch (err) {
      console.error(err);
      return message.channel.send('Ошибка при попытке удалить сообщения');
    }
  },
};

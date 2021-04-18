const schedule = require('node-schedule');
const pdate = require('../utility/pdate');
const pactuality = require('../functions/actuality');
const { channelIds } = require('../config');
const { getters: storeGetter, setters: storeSetter } = require('../store/index');
const { notify } = require('./rights');

module.exports = {
  name: 'crons',
  description: 'sets cron',
  async init(client) {
    const notifyTo = notify();

    // actuality every day at 22:00:00
    schedule.scheduleJob('0 0 22 * * *', async () => {
      const { actuality } = await pactuality.get() || {};

      if (!(actuality && 'content' in actuality)) {
        this.sendMessageToUsers(notifyTo, 'Ошибка при получении актуалочки', client);
        return;
      }

      if (actuality.shortId === storeGetter.getSavedShortId()) return;

      const msg = [];
      const channel = await client.channels.fetch(channelIds.dev);
      const channelMessages = await channel.messages.fetch({ limit: 100 });
      const messagesToDelete = (channelMessages.size > 1)
        ? await channel.messages.fetch({ limit: channelMessages.size - 1 }) : 0;

      msg.push('```');
      msg.push(`Актуалити. Обновлено: ${pdate.format(actuality.date, 'ru-RU')}\n`);
      msg.push(`${actuality.content}`);
      msg.push('```');

      try {
        // delete, only if bigger, than one
        if (messagesToDelete.size > 0) await channel.bulkDelete(messagesToDelete, true);
      } catch (err) {
        console.error(err);
        this.sendMessageToUsers(notifyTo, 'Ошибка при удалении сообщений в канале актуалочки', client);
      }

      channel.send(msg, { split: true })
        .then(() => storeSetter.setSavedShortId(actuality.shortId));
    });
  },
  sendMessageToUsers(users, message, client) {
    users.forEach((user) => client.users.fetch(user.id, false)
      .then((u) => u.send(`\`${message}\``)));
  },
};

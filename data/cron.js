const schedule = require('node-schedule');
const pdate = require('../utility/pdate');
const pactuality = require('../functions/actuality');
const { channelIds } = require('../config');
const { notify } = require('./rights');

module.exports = {
  name: 'crons',
  description: 'sets cron',
  async init(client) {
    const notifyTo = notify();

    schedule.scheduleJob('0 0 9 * * *', async () => {
      const { actuality } = await pactuality.get() || {};

      // actuality every day at 9:00:00
      if (!(actuality && 'content' in actuality)) {
        this.sendMessageToUsers(notifyTo, 'Ошибка при получении актуалочки', client);
        return;
      }

      const channel = await client.channels.fetch(channelIds.actuality);
      const channelAllMessages = await channel.messages.fetch({ limit: 100 });
      const channelMessagesToDelete = await channel.messages.fetch({ limit: channelAllMessages.size - 1 });

      const msg = [];
      msg.push('```');
      msg.push(`Актуалити. Обновлено: ${pdate.format(actuality.date, 'ru-RU')}\n`);
      msg.push(`${actuality.content}`);
      msg.push('```');

      try {
        if (channelAllMessages.size > 1) await channel.bulkDelete(channelMessagesToDelete, true);
      } catch (err) {
        console.error(err);
        this.sendMessageToUsers(notifyTo, 'Ошибка при удалении сообщений в канале актуалочки', client);
      }

      channel.send(msg, { split: true });
    });
  },
  sendMessageToUsers(users, message, client) {
    users.forEach((user) => {
      client.users.fetch(user.id, false)
        .then((u) => u.send(`\`${message}\``));
    });
  },
};

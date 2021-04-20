const schedule = require('node-schedule');
const pdate = require('../utility/pdate');
const pactuality = require('../functions/actuality');
const sendMessageToUsers = require('../functions/sendMessageToUsers');
const { notify } = require('./rights');
const {
  getters: storeGetter,
  setters: storeSetter,
  eventEmitter,
} = require('../store/index');

module.exports = {
  name: 'crons',
  description: 'sets cron',
  async init(client) {
    const notifyTo = notify();

    const channelIdToPost = () => storeGetter.getActualityChannel();
    const timeToPost = () => storeGetter.getActualityTime();

    if (!channelIdToPost() || !timeToPost()) return;
    // actuality every day at 22:00:00
    const actualityJob = schedule.scheduleJob(timeToPost(), async () => {
      const { actuality } = await pactuality.get() || {};

      if (!(actuality && 'content' in actuality)) {
        sendMessageToUsers(notifyTo, 'Ошибка при получении актуалочки', client);
        return;
      }

      if (actuality.shortId === storeGetter.getSavedShortId()) return;

      const msg = [];
      let channel;

      try {
        channel = await client.channels.fetch(channelIdToPost());
      } catch {
        sendMessageToUsers(notifyTo, 'Ошибка при получении канала для автопостинга актуалочки', client);
        return;
      }

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
        sendMessageToUsers(notifyTo, 'Ошибка при удалении сообщений в канале актуалочки', client);
      }

      channel.send(msg, { split: true })
        .then(() => storeSetter.setSavedShortId(actuality.shortId));
    });

    // onEventName reSchedule schedule
    ['actualityChannel', 'actualityTime'].forEach((eventName) => {
      eventEmitter.on(eventName, async () => {
        console.info(`[${eventName}] change was detected`);
        actualityJob.reschedule(timeToPost());
      });
    });
  },
};

const schedule = require('node-schedule');
const { getters: storeGetter, setters: storeSetter, eventEmitter } = require('../store/index');
const { get: getActuality } = require('../functions/actuality');
const { sendMessageToUsers, getRandomArrayItem } = require('../helpers');
const { admins } = require('./rights');
const colors = require('./colors');

module.exports = {
  name       : 'cron',
  description: 'sets cron',
  async sendActualities(actuality, channel) {
    const actualities = [
      {
        title  : 'Несрочное актуалити',
        content: actuality.lazyContent,
      },
      {
        title  : 'Актуалити',
        content: actuality.content,
      },
    ].filter((a) => a.content);

    actualities.forEach((a) => {
      const actualityEmbed = {
        color : getRandomArrayItem(colors),
        author: {
          name    : a.title,
          icon_url: 'https://woka.site/LRS7Mvd10',
        },
        description: a.content,
        timestamp  : actuality.date,
      };

      return channel.send({ embeds: [actualityEmbed] });
    });
  },
  async init(client) {
    const channelIdToPost = () => storeGetter.getActualityChannel();
    const timeToPost = () => storeGetter.getActualityTime();

    // actuality schedule
    const actualityJob = schedule.scheduleJob(timeToPost(), async () => {
      if (!channelIdToPost()) return;

      await getActuality()
        .then(async (actuality) => {
          if (actuality.shortId === storeGetter.getSavedShortId()) return;

          const channel = await client.channels.fetch(channelIdToPost());
          const channelMessages = await channel.messages.fetch({ limit: 100 });
          await channel.bulkDelete(channelMessages, true);

          this.sendActualities(actuality, channel)
            .then(() => storeSetter.setSavedShortId(actuality.shortId));
        })
        .catch(() => sendMessageToUsers(admins, 'Ошибка в автопостинге актуалочки', client));
    });

    // onEventName reSchedule schedule job
    eventEmitter.on('actualityTime', async () => {
      console.info('[actualityTime] change was detected');
      actualityJob.reschedule(timeToPost());
    });
  },
};

const { MessageButton, MessageActionRow } = require('discord.js');
const { getters: storeGetter } = require('../store/index');
const { getRandomArrayItem } = require('../helpers');
const { get: getActuality } = require('../functions/actuality');
const colors = require('../data/colors');

module.exports = {
  name       : 'actuality',
  description: 'Выводит "актуалочку"',
  aliases    : ['a', 'act', 'news', 'акт'],
  arguments  : {
    lazy: {
      name       : 'lazy',
      description: 'получает "несрочную" актуалочку',
    },
    au: {
      name       : 'au',
      description: 'обновляет настройки автопостинга',
      permissions: ['ADMINISTRATOR'],
    },
  },
  sendActuality(message, command) {
    return getActuality()
      .then(async (actuality) => {
        const embedTitle = command === 'lazy' ? 'Несрочное актуалити' : 'Актуалити';
        const embedContent = command === 'lazy' ? 'lazyContent' : 'content';

        const actualityEmbed = {
          color : getRandomArrayItem(colors),
          author: {
            name    : embedTitle,
            icon_url: 'https://woka.site/LRS7Mvd10',
          },
          description: actuality[embedContent] || 'Пусто 😔',
          timestamp  : actuality.date,
        };

        return message.channel.send({ embeds: [actualityEmbed] });
      })
      .catch((e) => {
        let errorMessage = '`Непредвиденская ошибка сервера 😔`';

        if (e.error) errorMessage = `\`${e.error}\``;

        message.channel.send(errorMessage);
      });
  },
  async sendAutopostingConfig(message) {
    const currChannelId = storeGetter.getActualityChannel();
    const currChannel = await message.guild.channels.cache.get(currChannelId);
    const currTime = storeGetter.getActualityTime();
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('changeActualityAutopostingChannel')
        .setLabel('Сменить канал')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('changeActualityAutopostingTime')
        .setLabel('Сменить время')
        .setStyle('SECONDARY'),
    );

    const actualityEmbed = {
      color : getRandomArrayItem(colors),
      author: {
        name    : 'Текущие настройки автопостинга',
        icon_url: 'https://woka.site/LRS7Mvd10',
      },
      fields: [
        {
          name  : 'Канал',
          value : `${currChannel || 'не установлен'}`,
          inline: true,
        },
        {
          name  : 'Время',
          value : `\`${currTime}\``,
          inline: true,
        },
      ],
    };

    return message.channel.send({
      embeds    : [actualityEmbed],
      components: [row],
    });
  },

  async execute(message, args) {
    const [command] = args;

    if (command === 'au') return this.sendAutopostingConfig(message);

    return this.sendActuality(message, command);
  },
};

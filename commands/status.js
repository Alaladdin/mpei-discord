const fetch = require('node-fetch');
const { version } = require('../package.json');
const { isProd } = require('../config');
const { getUniversalUrl } = require('../data/requests');
const { getRandomArrayItem } = require('../helpers');
const colors = require('../data/colors');

module.exports = {
  name       : 'status',
  description: 'Выводит информацию о боте',
  aliases    : ['info', 'i'],
  async execute(message) {
    const getServerData = (query) => fetch(getUniversalUrl(query))
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok) throw (json);

        return Object.values(json)[0];
      })
      .catch((err) => {
        console.error(err);
        return 'Error';
      });

    const actualityEmbed = {
      color : getRandomArrayItem(colors),
      author: {
        name    : 'Status',
        icon_url: 'https://woka.site/LRS7Mvd10',
      },
      fields: [
        {
          name  : 'Bot version',
          value : version,
          inline: true,
        },
        {
          name  : 'Server version',
          value : await getServerData('version'),
          inline: true,
        },
        {
          name  : 'isProduction',
          value : `${isProd}`,
          inline: true,
        },
      ],
    };

    return message.channel.send({ embeds: [actualityEmbed] });
  },
};

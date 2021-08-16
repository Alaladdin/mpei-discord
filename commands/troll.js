const { getRandomArrayItem } = require('../helpers');
const { trollings } = require('../data/phrases');

module.exports = {
  name       : 'troll',
  description: 'Троллит, притом жесска',
  aliases    : ['t'],
  arguments  : [{
    name       : '[name]',
    description: 'кого троллить',
  }],
  async execute(message, args) {
    if (!args.length) return message.reply('Кого троллить?');

    const name = args.join(' ');
    const trolling = getRandomArrayItem(trollings);

    return message.channel.send(trolling.replace('{name}', name));
  },
};

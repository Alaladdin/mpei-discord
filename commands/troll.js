const random = require('../utility/random');
const trollings = require('../data/trollings');

module.exports = {
  name: 'troll',
  description: 'Троллит, притом жесска',
  aliases: ['t'],
  usage: '[name]',
  arguments: [
    {
      name: '[name]',
      description: 'кого троллить',
    },
  ],
  async execute(message, args) {
    const personToTroll = args[0];
    if (!personToTroll || personToTroll.length <= 0) return message.reply('Кого троллить то?');
    return message.channel.send(`${personToTroll} ${trollings[random.int(trollings.length)]}`);
  },
};

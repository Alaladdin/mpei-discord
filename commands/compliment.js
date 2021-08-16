const { getRandomArrayItem } = require('../helpers');
const { compliments } = require('../data/phrases');

module.exports = {
  name       : 'compliment',
  description: 'Утопляет комплиментами. Осторожно, чрезмерное использование может привести к дружелюбной обстановке',
  aliases    : ['c'],
  async execute(message, args) {
    if (!args.length) return message.reply('Кому направить комплимент?');

    const name = args.join(' ');
    const compliment = getRandomArrayItem(compliments);

    return message.channel.send(compliment.replace('{name}', name));
  },
};

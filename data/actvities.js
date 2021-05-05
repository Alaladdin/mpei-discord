const rand = require('../util/random');

module.exports = {
  default: {
    type: 'PLAYING',
    name: [
      'with your mom',
      'with your mamasitta',
      'with your momello',
      'with your mammy',
      'with your dad 😳',
    ][rand.int(4)],
  },
  watchingSteam: {
    type: 'STREAMING', // WATCHING
    name: 'lesson on youtube',
    // url: 'https://www.youtube.com/channel/UCO5OTOVKPgFgb0BaqXes7Ag',
  },
  developing: {
    type: 'LISTENING',
    name: 'your suggestions',
  },
};

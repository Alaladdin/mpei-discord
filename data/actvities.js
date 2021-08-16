const { getRandomArrayItem } = require('../helpers');

module.exports = {
  default: {
    type: 'PLAYING',
    name: getRandomArrayItem([
      'with your mom',
      'with your mamasitta',
      'with your momello',
      'with your mammy',
      'with your dad 😳',
    ]),
  },
  steaming: {
    type: 'STREAMING',
    name: 'lesson on youtube',
    url : 'https://www.youtube.com/watch?v=5qap5aO4i9A',
  },
  developing: {
    type: 'LISTENING',
    name: 'your suggestions',
  },
};

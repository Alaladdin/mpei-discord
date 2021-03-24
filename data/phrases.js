module.exports = {
  name: 'phrases',
  accessError: [
    'ты играешь с огнем',
    'у тебя недостаточно прав для таких приколов',
    'не шути со мной, парень',
    'доступ запрещен',
    'ты связываешься с силой, которую не в силах понять',
  ],
  random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
};

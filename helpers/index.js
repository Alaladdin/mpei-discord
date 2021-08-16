const getCommand = (commands, commandName) => {
  const command = commandName.toLowerCase();

  return commands.get(command) || commands.find((c) => c.aliases && c.aliases.includes(command));
};

const checkPermissions = (message, permissions) => {
  if (!message.guild) return false;

  return !!(message.member.roles && message.member.permissions.has(permissions));
};

const getRandomInt = (max = 1) => Math.floor(Math.random() * max);
const getRandomArrayItem = (arr) => arr[getRandomInt(arr.length)];
const capitalize = (string) => string[0].toUpperCase() + string.slice(1);

const sendMessageToUsers = (users = {}, message = '', client = {}) => {
  users.forEach((user) => client.users.fetch(user.id, false)
    .then((u) => u.send(`\`${message}\``)));
};

module.exports = {
  getCommand,
  getRandomInt,
  getRandomArrayItem,
  checkPermissions,
  capitalize,
  sendMessageToUsers,
};

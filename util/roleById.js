module.exports = {
  name: 'roleById',
  description: 'get user role by user id',
  get(message, id) {
    return message.guild.roles.cache.get(id);
  },
};

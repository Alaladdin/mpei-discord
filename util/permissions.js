module.exports = {
  name: 'permissions',
  description: 'get user permission by role',
  check(message, permissions) {
    if (!message.guild) return false;

    const member = message.guild.member(message.author);

    return !!(member.roles && member.permissions.has(permissions));
  },
};

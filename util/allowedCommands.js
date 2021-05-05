module.exports = {
  name: 'allowedCommands',
  description: 'get user allowed commands by role',
  get(user, commands) {
    const allowedCommands = [];

    if (user.roles) {
      commands.forEach((command) => {
        if (!command.roles || user.roles.cache.some((role) => command.roles.includes(role.id))) {
          allowedCommands.push(command);
        }
      });
    } else {
      return commands.filter((command) => !command.roles);
    }

    return allowedCommands;
  },
};

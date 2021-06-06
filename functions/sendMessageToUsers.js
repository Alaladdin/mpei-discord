module.exports = (users = {}, message = '', client = {}) => {
  users.forEach((user) => {
    client.users.fetch(user.id, false)
      .then((u) => u.send(`\`${message}\``));
  });
};

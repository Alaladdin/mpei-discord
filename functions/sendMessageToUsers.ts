module.exports = (users: {}[], message: string, client: object) => {
  users.forEach((user) => client.users.fetch(user.id, false)
    .then((u) => u.send(`\`${message}\``)));
};

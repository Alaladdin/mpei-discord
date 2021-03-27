const fs = require('fs');

const eventFolders = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

module.exports = {
  name: 'commands',
  description: 'get events',
  init(client) {
    eventFolders.forEach((file) => {
      const event = require(`../events/${file}`);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    });
  },
};

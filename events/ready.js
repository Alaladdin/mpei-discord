module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    client.user.setPresence({
      activity: {
        name: 'with your mother',
      },
      status: 'dnd',
    });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};

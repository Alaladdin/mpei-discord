const Discord = require('discord.js');
const commands = require('./data/commands');
const events = require('./data/events');
const cron = require('./cron');
const { token } = require('./config');

const client = new Discord.Client({
  intents        : ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MESSAGES'],
  partials       : ['CHANNEL'],
  allowedMentions: { parse: ['users', 'roles'] },
});

client.login(token).then(() => cron.init(client));
client.commands = new Discord.Collection();

commands.init(client);
events.init(client);

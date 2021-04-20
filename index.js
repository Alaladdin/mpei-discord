const Discord = require('discord.js');
const commands = require('./data/commands');
const events = require('./data/events');
const cron = require('./data/cron');
const { token } = require('./config');

const client = new Discord.Client();

// init
client.login(token).then(() => cron.init(client));

client.commands = new Discord.Collection();

commands.init(client);
events.init(client);

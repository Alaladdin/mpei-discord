const Discord = require('discord.js');
const commands = require('./data/commands');
const events = require('./data/events');
const { token } = require('./config');

const client = new Discord.Client();

// init
client.login(token);
client.commands = new Discord.Collection();

commands.init(client);
events.init(client);

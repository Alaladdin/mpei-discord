require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  prefix: process.env.PREFIX,
  token: process.env.TOKEN,
  serverAddress: isProd ? process.env.PROD_SERVER : process.env.DEV_SERVER,
  channelIds: {
    actuality: isProd ? '832343311368192081' : '822176467978158100',
    dev: '822176467978158100',
  },
};

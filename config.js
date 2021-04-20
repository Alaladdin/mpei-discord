require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  prefix: '!',
  token: process.env.token,
  serverAddress: isProd ? process.env.prodServerAddress : process.env.devServerAddress,
  channelIds: {
    actuality: isProd ? '832343311368192081' : '822176467978158100',
    dev: '822176467978158100',
  },
};

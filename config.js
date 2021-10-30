require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  authToken        : process.env.AUTH_TOKEN,
  prefix           : process.env.PREFIX,
  token            : process.env.TOKEN,
  serverAddress    : process.env.SERVER_ADDRESS,
  defaultDateFormat: 'DD.MM',
  serverDateFormat : 'YYYY.MM.DD',
  channelIds       : {
    actuality: isProd ? '832343311368192081' : '822176467978158100',
    dev      : '822176467978158100',
  },
};

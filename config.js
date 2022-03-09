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
};

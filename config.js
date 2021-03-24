require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  prefix: '!',
  token: process.env.token,
  serverAddress: isProd ? process.env.prodServerAddress : process.env.devServerAddress,
};

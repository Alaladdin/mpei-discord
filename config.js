require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  prefix: '!',
  token: process.env.token,
  serverAddress: isProd ? process.env.prodServerAddress : process.env.devServerAddress,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  publicKey: process.env.publicKey,
  isProd,
};

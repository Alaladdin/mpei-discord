const actualityCron = require('./actuality');

module.exports = {
  init(client) {
    actualityCron.init(client);
  },
};

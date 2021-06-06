const events = require('events');
const { getConfig, setConfig } = require('../functions/storeConfigMethods');

events.captureRejections = true;

const eventEmitter = new events.EventEmitter();
let state = {};

(async () => {
  const remoteConfig = await getConfig().catch(() => ({}));

  state = {
    savedShortId: remoteConfig.savedShortId || '',
    actualityChannel: remoteConfig.actualityChannel || '',
    actualityTime: remoteConfig.actualityTime || '0 0 22 * * *',
  };
})();

const getters = {
  getSavedShortId: () => state.savedShortId,
  getActualityChannel: () => state.actualityChannel,
  getActualityTime: () => state.actualityTime,
};

const setters = {
  async listener(eventName) {
    // write config to the DB
    return setConfig(state)
      .then((updatedState) => {
        eventEmitter.emit(eventName);
        return updatedState;
      });
  },
  async setSavedShortId(newVal = '') {
    state.savedShortId = newVal;
    return this.listener('savedShortId');
  },
  async setActualityChannel(newVal = '') {
    state.actualityChannel = newVal;
    return this.listener('actualityChannel');
  },
  async setActualityTime(newVal = '') {
    state.actualityTime = newVal;
    return this.listener('actualityTime');
  },
};

module.exports = {
  state,
  getters,
  setters,
  eventEmitter,
};

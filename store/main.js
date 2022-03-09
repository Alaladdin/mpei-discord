const events = require('events');
const { getStore, setStore } = require('../functions/storeMethods');

events.captureRejections = true;

const eventEmitter = new events.EventEmitter();
let state = {};

(async () => {
  const remoteStore = await getStore().catch(() => ({}));

  state = {
    savedShortId    : remoteStore.savedShortId || '',
    actualityChannel: remoteStore.actualityChannel || '',
    actualityTime   : remoteStore.actualityTime || '0 0 22 * * *',
  };
})();

const getters = {
  getSavedShortId    : () => state.savedShortId,
  getActualityChannel: () => state.actualityChannel,
  getActualityTime   : () => state.actualityTime,
};

const setters = {
  async handleUpdate(eventName) {
    // write config to the DB
    return setStore(state)
      .then((updatedState) => {
        eventEmitter.emit(eventName);
        return updatedState;
      });
  },
  async setSavedShortId(newVal = '') {
    state.savedShortId = newVal;
    return this.handleUpdate('savedShortId');
  },
  async setActualityChannel(newVal = '') {
    state.actualityChannel = newVal;
    return this.handleUpdate('actualityChannel');
  },
  async setActualityTime(newVal = '') {
    state.actualityTime = newVal;
    return this.handleUpdate('actualityTime');
  },
};

module.exports = {
  state,
  getters,
  setters,
  eventEmitter,
};

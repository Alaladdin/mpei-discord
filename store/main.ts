import events from 'events';
import writeStoreToFile from './writeStoreToFile';
import localStore from './localStore.json';

events.captureRejections = true;
const eventEmitter = new events.EventEmitter();

interface IState {
  savedShortId: string | undefined,
  actualityChannel: string | undefined,
  actualityTime: string | undefined,
}

const state: IState = {
  savedShortId: localStore.savedShortId || '',
  actualityChannel: localStore.actualityChannel || '',
  actualityTime: localStore.actualityTime || '',
};

const getters = {
  getSavedShortId: (): string => state.savedShortId,
  getActualityChannel: (): string => state.actualityChannel,
  getActualityTime: (): string => state.actualityTime,
};

const setters = {
  listener(eventName: string = ''): void {
    writeStoreToFile(state)
      .then(() => {
        if (eventName) eventEmitter.emit(eventName);
      });
  },
  setSavedShortId(newVal: string): void {
    state.savedShortId = newVal;
    this.listener('savedShortId');
  },
  setActualityChannel(newVal: string): void {
    state.actualityChannel = newVal;
    this.listener('actualityChannel');
  },
  setActualityTime(newVal: string): void {
    state.actualityTime = newVal;
    this.listener('actualityTime');
  },
};

export {
  state,
  getters,
  setters,
  eventEmitter,
};

import events from 'events';
import writeLocalStore from './writeLocalStore';
import readLocalStore from './readLocalStore';

const localStore = readLocalStore();

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
  actualityTime: localStore.actualityTime || '0 0 22 * * *',
};

const getters = {
  getSavedShortId: (): string => state.savedShortId,
  getActualityChannel: (): string => state.actualityChannel,
  getActualityTime: (): string => state.actualityTime,
};

const setters = {
  listener(eventName: string = ''): void {
    writeLocalStore(state)
      .then(() => eventName && eventEmitter.emit(eventName));
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

import fs from 'fs';
import path from 'path';
import localStore from './localStore.json';

const root = path.dirname(require.main.filename);

interface IState {
  savedShortId: string,
}

const state: IState = {
  savedShortId: localStore.savedShortId || '',
};

const writeToFile = () => {
  const data: string = JSON.stringify(state);
  const storePath: string = path.resolve(root, 'store');

  fs.writeFile(`${storePath}/localStore.json`, data, (err): void => {
    if (err) {
      console.log('There has been an error saving your configuration data.');
      console.log(err.message);
      return;
    }
    console.log('Configuration saved successfully.');
  });
};

const getters = {
  getSavedShortId: (): string => state.savedShortId,
};

const setters = {
  setSavedShortId: (newVal: string): void => {
    state.savedShortId = newVal;
    writeToFile();
  },
};

export {
  state,
  getters,
  setters,
};

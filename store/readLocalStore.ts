import fs from 'fs';
import path from 'path';

export default (): object => {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'localStore.json'), 'utf-8'));
  } catch (err) {
    return {};
  }
};

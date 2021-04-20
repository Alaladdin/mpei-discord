import path from 'path';
import fs from 'fs';

export default (writeData: object): Promise<string> => {
  const root: string = path.dirname(require.main.filename);
  const data: string = JSON.stringify(writeData);
  const storePath: string = path.resolve(root, 'store');

  return fs.promises.writeFile(`${storePath}/localStore.json`, data)
    .then((res) => {
      console.info('[LOCAL STORE] Configuration saved successfully.');
      return res;
    }).catch((err) => {
      console.log('[LOCAL STORE] There has been an error saving your configuration data.');
      console.error(err.message);
      return err;
    });
};

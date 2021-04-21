import path from 'path';
import fs from 'fs';

export default (writeData: object): Promise<string> => {
  const data: string = JSON.stringify(writeData);

  return fs.promises.writeFile(`${path.join(__dirname, 'localStore.json')}`, data, 'utf-8')
    .then((res) => {
      console.info('[LOCAL STORE] Configuration saved successfully.');
      return res;
    }).catch((err) => {
      console.log('[LOCAL STORE] There has been an error saving your configuration data.');
      console.error(err.message);
      return err;
    });
};

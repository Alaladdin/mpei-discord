const { isProd } = require('../config');

const data = {
  admins: [
    {
      name: 'Aladdin',
      id: '286937566693818368',
    },
    {
      name: 'Drobot',
      id: '295947226147192833',
    },
  ],
  blacklist: [
    {
      name: 'Vorona',
      id: '815609494729130076',
    },
  ],
};

module.exports = {
  admins() {
    return data.admins;
  },
  blacklist() {
    return data.blacklist;
  },
  notify() {
    const notifyTo = isProd ? ['Aladdin', 'Drobot'] : ['Aladdin'];
    return data.admins.filter((admin) => notifyTo.includes(admin.name));
  },
};

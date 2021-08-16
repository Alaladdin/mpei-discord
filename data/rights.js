const data = {
  admins: [
    {
      name: 'Aladdin',
      id  : '286937566693818368',
    },
    {
      name: 'Drobot',
      id  : '295947226147192833',
    },
  ],
};

module.exports = {
  admins: [
    ...data.admins,
  ],
};

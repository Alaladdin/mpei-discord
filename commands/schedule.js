const moment = require('moment');
const { defaultDateFormat, serverDateFormat } = require('../config');
const pschedule = require('../functions/schedule');

module.exports = {
  name: 'schedule',
  description: 'Расписание на сегодняшний день',
  aliases: ['s', 'расписание', 'р'],
  usage: '',
  arguments: [
    {
      name: 'tw',
      description: 'расписание на завтра',
    },
    {
      name: 'week',
      description: 'расписание на неделю',
    },
    {
      name: 'nextWeek',
      description: 'расписание следующую неделю',
    },
    {
      name: 'month',
      description: 'расписание месяц',
    },
  ],
  async execute(message, args) {
    const today = moment().format(serverDateFormat);
    const tomorrow = moment().add(1, 'days').format(serverDateFormat);
    const [command] = args;
    const argsInstructions = {
      tw: {
        name: 'завтра',
        start: tomorrow,
        finish: tomorrow,
      },
      week: {
        name: 'неделю',
      },
      nextWeek: {
        name: 'следующую неделю',
        start: moment().add(1, 'weeks').startOf('isoWeek').format(serverDateFormat),
        finish: moment().add(1, 'weeks').endOf('isoWeek').format(serverDateFormat),
      },
      month: {
        name: 'месяц',
        start: today,
        finish: moment().add(1, 'month').format(serverDateFormat),
      },
      empty: {
        name: 'сегодня',
        start: today,
        finish: today,
      },
    };

    if (command && (command === 'empty' || !argsInstructions[command])) {
      message.reply(`не знаю, что за аргумент такой \`${command}\``);
      return;
    }

    // return message
    message.channel.send('`Получаю данные с сервера...`')
      .then(async (sentMessage) => {
        const selectedDate = argsInstructions[!args.length ? 'empty' : command];
        const { schedule } = await pschedule.get(selectedDate) || {};

        if (typeof schedule !== 'object' && !Array.isArray(schedule)) {
          sentMessage.edit('`Ошибка при попытке получить расписание`');
          return;
        }

        sentMessage.edit(`\`Расписание на ${selectedDate.name}\``);

        // if schedule data not exists
        if (Array.isArray(schedule) && schedule.length <= 0) {
          message.channel.send('Занятий нет 😎');
          return;
        }

        schedule.forEach((item) => {
          const itemData = [];
          const {
            date,
            discipline,
            dayOfWeekString,
            kindOfWork,
            beginLesson,
            endLesson,
            lecturer,
          } = item;

          itemData.push('```');
          itemData.push(`[${dayOfWeekString}] ${discipline} - ${moment(new Date(date))
            .format(defaultDateFormat)}`);
          itemData.push(kindOfWork);
          itemData.push(`${beginLesson} - ${endLesson}`);
          itemData.push(lecturer);
          itemData.push('```');

          return message.channel.send(itemData, { split: true });
        });
      });
  },
};

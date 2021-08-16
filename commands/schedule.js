const moment = require('moment');
const { defaultDateFormat, serverDateFormat } = require('../config');
const pschedule = require('../functions/schedule');
const { capitalize, getRandomArrayItem } = require('../helpers');
const colors = require('../data/colors');

module.exports = {
  name       : 'schedule',
  description: 'Расписание на сегодняшний день',
  aliases    : ['s', 'расписание', 'р'],
  arguments  : [
    {
      name       : 'tw',
      description: 'расписание на завтра',
    },
    {
      name       : 'week',
      description: 'расписание на неделю',
    },
    {
      name       : 'nextWeek',
      description: 'расписание следующую неделю',
    },
    {
      name       : 'month',
      description: 'расписание месяц',
    },
  ],
  sendSchedule(message, schedule) {
    schedule.forEach((i) => {
      const scheduleFields = [];
      const scheduleDate = moment(new Date(i.date))
        .format(defaultDateFormat);
      const scheduleEmbed = {
        color    : getRandomArrayItem(colors),
        title    : `[${i.dayOfWeekString}] ${i.discipline} - ${scheduleDate}`,
        fields   : scheduleFields,
        timestamp: new Date(`${i.date} ${i.beginLesson}`),
      };

      scheduleFields.push(
        {
          name : 'Время',
          value: `${i.beginLesson} - ${i.endLesson}`,
        },
        {
          name : 'Тип',
          value: capitalize(i.kindOfWork),
        },
        {
          name : 'Препод',
          value: i.lecturer,
        },
      );

      return message.channel.send({ embeds: [scheduleEmbed] });
    });
  },
  async execute(message, args) {
    const today = moment()
      .format(serverDateFormat);
    const tomorrow = moment()
      .add(1, 'days')
      .format(serverDateFormat);
    const [command] = args;
    const argsInstructions = {
      tw: {
        name  : 'завтра',
        start : tomorrow,
        finish: tomorrow,
      },
      week: {
        name: 'неделю',
      },
      nextweek: {
        name : 'следующую неделю',
        start: moment()
          .add(1, 'weeks')
          .startOf('isoWeek')
          .format(serverDateFormat),
        finish: moment()
          .add(1, 'weeks')
          .endOf('isoWeek')
          .format(serverDateFormat),
      },
      month: {
        name  : 'месяц',
        start : today,
        finish: moment()
          .add(1, 'month')
          .format(serverDateFormat),
      },
      empty: {
        name  : 'сегодня',
        start : today,
        finish: today,
      },
    };

    if (command && (command === 'empty' || !argsInstructions[command.toLowerCase()])) {
      return message.reply(`Не знаю, что за аргумент такой \`${command}\``);
    }

    // return message
    return message.channel.send('`Получаю данные с сервера...`')
      .then(async (sentMessage) => {
        const selectedDate = argsInstructions[!args.length ? 'empty' : command.toLowerCase()];
        const schedule = await pschedule.get(selectedDate);

        if (!schedule) return sentMessage.edit('`Ебаные сервера МЭИ снова не отвечают`');

        sentMessage.edit(`\`Расписание на ${selectedDate.name}\``);

        // if schedule data not exists
        if (Array.isArray(schedule) && schedule.length <= 0) return message.channel.send('Занятий нет 😎');

        return this.sendSchedule(message, schedule);
      });
  },
};

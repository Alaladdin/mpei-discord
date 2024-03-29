const moment = require('moment');
const { serverDateFormat } = require('../config');
const getSchedule = require('../functions/getSchedule');
const { getRandomArrayItem } = require('../helpers');
const colors = require('../data/colors');

module.exports = {
  name       : 'schedule',
  description: 'Расписание на сегодняшний день',
  aliases    : ['s', 'расписание', 'р'],
  arguments  : [
    { name: 'tw', description: 'расписание на завтра' },
    { name: 'week', description: 'расписание на неделю' },
    { name: 'month', description: 'расписание месяц' },
  ],
  sendSchedule(message, schedule) {
    schedule.forEach((i) => {
      const scheduleFields = [];
      const scheduleEmbed = {
        color      : getRandomArrayItem(colors),
        title      : `[${i.dayOfWeekString}] ${i.date} (${i.kindOfWork})`,
        description: `\`${i.discipline}\``,
        fields     : scheduleFields,
        timestamp  : new Date(`${i.date} ${i.beginLesson}`),
        footer     : {
          text: `${i.beginLesson} - ${i.endLesson}`,
        },
      };

      scheduleFields.push({
        name : 'Препод',
        value: i.lecturer,
      });

      if (i.building !== '-') {
        scheduleFields.push({
          name  : 'Кабинет',
          value : `${i.auditorium} (${i.building})`,
          inline: true,
        });
      }

      if (i.group) {
        scheduleFields.push({
          name  : 'Группа',
          value : `${i.group}`,
          inline: true,
        });
      }

      return message.channel.send({ embeds: [scheduleEmbed] });
    });
  },
  async execute(message, args) {
    const [command] = args;
    const today = moment().format(serverDateFormat);
    const tomorrow = moment().add(1, 'days').format(serverDateFormat);
    const argsInstructions = {
      tw: {
        name  : 'завтра',
        start : tomorrow,
        finish: tomorrow,
      },
      week: {
        name  : 'неделю',
        start : today,
        finish: moment().add(1, 'week').format(serverDateFormat),
      },
      month: {
        name  : 'месяц',
        start : today,
        finish: moment().add(1, 'month').format(serverDateFormat),
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
        const schedule = await getSchedule(selectedDate);

        if (!schedule) return sentMessage.edit('`Ебаные сервера МЭИ снова не отвечают`');

        sentMessage.edit(`\`Расписание на ${selectedDate.name}\``);

        // if schedule data not exists
        if (Array.isArray(schedule) && schedule.length <= 0) return message.channel.send('Занятий нет 😎');

        return this.sendSchedule(message, schedule);
      });
  },
};

const pdate = require('../utility/pdate');
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
  ],
  async execute(message, args) {
    const today = pdate.format(new Date().toString());
    const tomorrow = pdate.format(new Date().setDate(new Date().getDate() + 1));
    const [command] = args;

    const argsInstructions = {
      week: {
        name: 'неделю',
      },
      tw: {
        name: 'завтра',
        start: tomorrow,
        finish: tomorrow,
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
        let { schedule } = await pschedule.get(selectedDate) || {};
        const scheduleLength = schedule ? schedule.length : 0;
        const scheduleIndexesToDelete = [];

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

        // compare two nearest array elements
        for (let i = 0; i <= scheduleLength - 2; i += 2) {
          const c = schedule[i]; // current elements
          const n = schedule[i + 1]; // next element
          if (!n) break; // stop loop, if next element not exists

          if (
            (c.date === n.date)
            && (c.discipline === n.discipline)
            && (c.kindOfWork === n.kindOfWork)
            && (c.lecturer === n.lecturer)
          ) {
            // combine two array elements
            schedule[i].endLesson = n.endLesson;
            scheduleIndexesToDelete.push(i + 1);
          }
        }

        // filter array
        schedule = this.filterArray(schedule, scheduleIndexesToDelete);

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
          itemData.push(`[${dayOfWeekString}] ${discipline} - ${pdate.format(date, 'ru-RU')}`);
          itemData.push(kindOfWork);
          itemData.push(`${beginLesson} - ${endLesson}`);
          itemData.push(lecturer);
          itemData.push('```');

          return message.channel.send(itemData, { split: true });
        });
      });
  },
  filterArray(arr = [], indexesArr = []) {
    const newArr = [...arr];

    for (let i = indexesArr.length - 1; i >= 0; i--) {
      newArr.splice(indexesArr[i], 1);
    }

    return newArr;
  },
};

const { checkPermissions } = require('../helpers');
const { getters: storeGetter, setters: storeSetter } = require('../store/index');

module.exports = {
  name: 'interactionCreate',
  formatActualityTime(string) {
    return string
      .replaceAll(/[^0-9|?* ]/gm, '')
      .split(' ')
      .filter((item) => item)
      .join(' ');
  },
  async setActualityChannel(interaction, newChannelId) {
    const currChannelId = storeGetter.getActualityChannel();
    const currChannel = await interaction.guild.channels.cache.get(currChannelId);
    const newChannel = await interaction.guild.channels.cache.get(newChannelId);

    if (!newChannel) return interaction.followUp('Канал с таким `id` не найден');

    return storeSetter.setActualityChannel(newChannelId)
      .then(() => {
        interaction.followUp(`Канал для автопостинга актуалочки изменен${currChannelId ? ` с ${currChannel.toString()}` : ''} на ${newChannel.toString()}`);
      })
      .catch((err) => {
        console.error(err);
        interaction.followUp('Ошибка при попытке изменить канал для автопостинга актуалочки');
      });
  },
  async setAutopostingTime(interaction, newTime) {
    const currTime = storeGetter.getActualityTime();
    const formattedTime = this.formatActualityTime(newTime);

    await storeSetter.setActualityTime(formattedTime)
      .then(() => {
        interaction.followUp(`Время автопостинга актуалочки изменено ${currTime ? `с \`${currTime}\`` : ''} на \`${formattedTime}\``);
      })
      .catch((err) => {
        console.error(err);
        interaction.followUp('Ошибка при попытке изменить время автопостинга');
      });
  },
  execute(interaction) {
    const hasPermission = checkPermissions(interaction, ['ADMINISTRATOR']);

    const buttonsInfo = {
      changeActualityAutopostingChannel: {
        title         : 'Укажи канал для автопостинга',
        resultFunction: this.setActualityChannel,
      },
      changeActualityAutopostingTime: {
        title         : 'Укажи время для автопостинга',
        resultFunction: this.setAutopostingTime,
      },
    };

    const interactionInfo = buttonsInfo[interaction.customId];

    if (!interaction.isButton() || !interactionInfo || !hasPermission) return;

    interaction.reply(interactionInfo.title)
      .then(() => {
        const filter = (m) => interaction.user.id === m.author.id;
        const awaitOptions = {
          filter,
          time  : 15000,
          max   : 1,
          errors: ['time'],
        };

        interaction.channel.awaitMessages(awaitOptions)
          .then((messages) => {
            interactionInfo.resultFunction.call(this, interaction, messages.first().content);
          })
          .catch(async (err) => {
            console.error(err);
            await interaction.followUp('Время для ввода истекло');
          });
      });
  },
};

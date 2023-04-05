const {
  Lobby,
  DUO_MODES,
  _3V3_MODES,
  _4V4_MODES
} = require('../db/models/lobby');
const { Duo } = require('../db/models/duo');

module.exports = {
  name: 'partner_unset',
  description: 'Unset your partner for Ranked Duos.',
  guildOnly: true,
  aliases: ['unset_partner', 'partner_remove', 'divorce', 'remove_partner'],
  cooldown: 15,
  // eslint-disable-next-line consistent-return
  async execute(message) {
    const { author, guild } = message;

    // eslint-disable-next-line max-len
    const authorSavedDuo = await Duo.findOne({ guild: guild.id, $or: [{ discord1: author.id }, { discord2: author.id }] });
    if (authorSavedDuo) {
      const gameModes = DUO_MODES.concat(_3V3_MODES).concat(_4V4_MODES);

      const lobby = await Lobby.findOne({
        type: { $in: gameModes },
        players: { $in: [authorSavedDuo.discord1, authorSavedDuo.discord2] },
      });

      if (lobby) {
        return message.channel.warn('You can\'t unset your partner while being in the lobby with them.');
      }

      authorSavedDuo.delete().then(() => message.channel.success('Your partner has been unset.'));
    } else {
      message.channel.warn('Your don\'t have a partner set.');
    }
  },
};

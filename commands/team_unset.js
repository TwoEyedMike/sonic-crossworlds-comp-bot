const {
  Lobby,
  _3V3_MODES,
  _4V4_MODES
} = require('../db/models/lobby');
const { Team } = require('../db/models/team');

module.exports = {
  name: 'team_unset',
  description: 'Unset your team for ranked 3 vs. 3 / 4 vs. 4.',
  guildOnly: true,
  aliases: ['unset_team', 'remove_team'],
  cooldown: 15,
  // eslint-disable-next-line consistent-return
  async execute(message) {
    const { author, guild } = message;

    const gameModes = _3V3_MODES.concat(_4V4_MODES);

    const team = await Team.findOne({ guild: guild.id, players: author.id });
    if (team) {
      const lobby = await Lobby.findOne({
        type: { $in: gameModes },
        players: { $in: team.players },
      });

      if (lobby) {
        return message.channel.warn('You can\'t unset your team while being in the lobby with it.');
      }

      team.delete().then(() => message.channel.success('Your team has been unset.'));
    } else {
      message.channel.warn('You don\'t have a team set.');
    }
  },
};

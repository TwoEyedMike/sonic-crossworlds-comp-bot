const {
  Lobby,
  RACE_ITEMLESS_3V3,
  RACE_ITEMLESS_4V4,
  BATTLE_3V3,
  BATTLE_4V4,
  INSTA_3V3,
  INSTA_4V4
} = require('../db/models/lobby');
const { Team } = require('../db/models/team');
const { RACE_3V3, RACE_4V4 } = require('../db/models/lobby');

module.exports = {
  name: 'team_unset',
  description: 'Unset your team for Ranked 4v4.',
  guildOnly: true,
  aliases: ['unset_team'],
  cooldown: 15,
  // eslint-disable-next-line consistent-return
  async execute(message) {
    const { author, guild } = message;

    const team = await Team.findOne({ guild: guild.id, players: author.id });
    if (team) {
      const lobby = await Lobby.findOne({
        type: { $in: [RACE_3V3, RACE_4V4, RACE_ITEMLESS_3V3, RACE_ITEMLESS_4V4, BATTLE_3V3, BATTLE_4V4, INSTA_3V3, INSTA_4V4] },
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

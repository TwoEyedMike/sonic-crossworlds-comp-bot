const { LEADERBOARD_URLS } = require('../db/models/lobby');
const findDuplicateLeaderboardPlayers = require('../utils/findDuplicateLeaderboardPlayers')

module.exports = {
  name: 'duplicates',
  description: 'Check the leaderboards for duplicate players',
  guildOnly: true,
  permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
  aliases: ['duplicate_players'],
  execute(message) {
    message.channel.info('Gathering data, this may take a while ...').then((m) => {
      findDuplicateLeaderboardPlayers().then((duplicatePlayers) => {
        m.delete();

        const keys = Object.keys(LEADERBOARD_URLS);
  
        for (const mode in keys) {
          if (!LEADERBOARD_URLS[keys[mode]]) {
            continue;
          }
  
          const duplicatesForLeaderboard = duplicatePlayers.filter((d) => d.leaderboard === keys[mode]);
  
          const format = (d) => {
            let text = `Player 1: ${d.name1.replace('_', '\\_')}\nPlayer 2: ${d.name2.replace('_', '\\_')}\n`;
  
            if (d.discordId) {
              text += `Discord: <@!${d.discordId}>`;
            } else {
              text += `Discord: -`;
            }
  
            return text;
          }
  
          if (duplicatesForLeaderboard.length > 0) {
            message.channel.warn(`There are ${duplicatesForLeaderboard.length} potential duplicate players on the ${keys[mode]} leaderboard.\n\n${duplicatesForLeaderboard.map(format).join('\n\n')}`);
          } else {
            message.channel.success(`There are no potential duplicate players on the ${keys[mode]} leaderboard. Good job!`);
          }
        }
      });
    });
  }
}
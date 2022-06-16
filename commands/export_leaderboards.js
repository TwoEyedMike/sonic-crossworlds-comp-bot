const { LEADERBOARD_URLS } = require('../db/models/lobby');
const { Player } = require('../db/models/player');
const getLorenziBoardData = require('../utils/getLorenziBoardData');

module.exports = {
  name: 'export_leaderboards',
  description: 'Export the ranked leaderboards as CSV',
  guildOnly: true,
  permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
  aliases: ['export_ranks', 'leaderboards'],
  async execute(message) {
    const tableHeadRow = [
      'Discord ID',
      'PSN ID',
      'Ranking',
      'Name',
      'MMR',
      'Matches played',
      'Win count',
      'Lose count',
      'Best ranking',
      'Worst ranking',
      'Max MMR',
      'Min MMR',
      'Max MMR gain',
      'Min MMR gain',
      'Total points',
      'Max points gain',
      'Last played',
      'First played'
    ];

    Object.keys(LEADERBOARD_URLS).forEach((mode) => {
      const teamId = LEADERBOARD_URLS[mode];

      getLorenziBoardData(teamId).then(async (leaderboard) => {
        if (leaderboard.data.data.team !== null) {
          /**
           * each player is an object that looks something like this:
           * 
           * name: 'Garma',
           * ranking: 27,
           * maxRanking: 50,
           * minRanking: 90,
           * wins: 20,
           * losses: 30,
           * playedMatchCount: 42,
           * firstActivityDate: 1645564972638,
           * lastActivityDate: 1645564972638,
           * rating: 1337.2355247742526,
           * ratingGain: 40,
           * maxRating: 1337.2355247742526,
           * minRating: 987,
           * maxRatingGain: 47,
           * maxRatingLoss: 24,
           * points: 901,
           * maxPointsGain: 34
           */
          const { players } = leaderboard.data.data.team;
          const playerRows = [];

          for (i in players) {
            rankedPlayer = players[i];
            if (!rankedPlayer || Number.isNaN(rankedPlayer.rating)) {
              continue;
            }

            discordId = '-';
            psn = '-';

            serverPlayer = await Player.findOne({ rankedName: rankedPlayer.name });
            if (serverPlayer) {
              discordId = serverPlayer.discordId;
              psn = serverPlayer.psn;
            }

            playerRows.push([
              String(discordId),
              psn,
              rankedPlayer.ranking + 1,
              rankedPlayer.name,
              parseInt(rankedPlayer.rating, 10),
              rankedPlayer.playedMatchCount,
              rankedPlayer.wins,
              rankedPlayer.losses,
              rankedPlayer.maxRanking,
              rankedPlayer.minRanking,
              parseInt(rankedPlayer.maxRating, 10),
              parseInt(rankedPlayer.minRating, 10),
              rankedPlayer.maxRatingGain,
              rankedPlayer.maxRatingLoss,
              rankedPlayer.points,
              rankedPlayer.maxPointsGain,
              rankedPlayer.firstActivityDate,
              rankedPlayer.lastActivityDate
            ]);
          }

          fileContent = tableHeadRow.join(';') + '\n';
          playerRows.forEach((playerRow) => {
            fileContent += playerRow.join(';') + '\n';
          })

          message.channel.send({
            files: [{
              attachment: Buffer.from(fileContent, 'utf-8'),
              name: `${mode}.csv`,
            }]
          });
        }
      });
    });
  }
}

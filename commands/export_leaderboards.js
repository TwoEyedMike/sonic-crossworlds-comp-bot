const { LEADERBOARD_URLS } = require('../db/models/lobby');
const { Player } = require('../db/models/player');
const dateToDateTime = require('../utils/dateToDateTime');
const getLorenziBoardData = require('../utils/getLorenziBoardData');

module.exports = {
  name: 'export_leaderboards',
  description: 'Export the ranked leaderboards as CSV',
  guildOnly: true,
  permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
  aliases: ['export_ranks', 'leaderboards'],
  execute(message) {
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
      'Max MMR loss',
      'Total points',
      'Max points gain',
      'Last played',
      'First played'
    ];

    Object.keys(LEADERBOARD_URLS).forEach((mode) => {
      const teamId = LEADERBOARD_URLS[mode];

      getLorenziBoardData(teamId).then((leaderboard) => {
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

          const playerPromises = [];
          for (i in players) {
            promise = Player.findOne({ rankedName: players[i].name });
            playerPromises.push(promise);
          }

          Promise.all(playerPromises).then((serverPlayers) => {
            const playerRows = [];

            for (i in players) {
              const rankedPlayer = players[i];
              const serverPlayer = serverPlayers.find((s) => s && s.rankedName === rankedPlayer.name);

              let discordId = '-';
              let psn = '-';

              if (serverPlayer) {
                discordId = serverPlayer.discordId;
                psn = serverPlayer.psn;
              }

              const lastPlayed = new Date(rankedPlayer.lastActivityDate);
              const firstPlayed = new Date(rankedPlayer.firstActivityDate);

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
                dateToDateTime(lastPlayed),
                dateToDateTime(firstPlayed)
              ]);
            }

            message.channel.offerCsvDownload(tableHeadRow, playerRows, `${mode}.csv`);
          });
        }
      });
    });
  }
}

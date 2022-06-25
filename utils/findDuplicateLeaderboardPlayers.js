const levenshtein = require('js-levenshtein');
const { LEADERBOARD_URLS } = require('../db/models/lobby');
const { Player } = require('../db/models/player');
const getLorenziBoardData = require('../utils/getLorenziBoardData');

/**
 * Checks the leaderboard for duplicate players
 * This function is slow as hell
 * @param Number similarityThreshold
 * @return Array
 */
 async function findDuplicateLeaderboardPlayers(similarityThreshold = 5) {
  const duplicatePlayers = [];

  const keys = Object.keys(LEADERBOARD_URLS);
  const serverPlayers = await Player.find();

  for (const mode in keys) {
    const teamId = LEADERBOARD_URLS[keys[mode]];

    if (teamId !== null) {
      const response = await getLorenziBoardData(teamId);

      if (response.data.data.team !== null) {
        const { players } = response.data.data.team;

        // this is where the fun begins
        players.forEach((p1) => {
          players.forEach((p2) => {
            if (p1.name === p2.name) {
              return;
            }

            const similarity = levenshtein(p1.name, p2.name);

            if (similarity <= similarityThreshold) {
              // we found a potential duplicate
              serverPlayer1 = serverPlayers.find((p) => p.rankedName === p1.name);
              serverPlayer2 = serverPlayers.find((p) => p.rankedName === p2.name);

              if (serverPlayer1 && serverPlayer2) {
                // one of the players must not exist on the server - this sorts out players like neko and shroob 
                // who have similar ranked names (Nekoglacia <-> Pekoglacia)
                return;
              }

              const p1EntryExists = duplicatePlayers.find((d) => d.name1 === p1.name || d.name2 === p1.name);
              const p2EntryExists = duplicatePlayers.find((d) => d.name1 === p2.name || d.name2 === p2.name);

              if (p1EntryExists && p2EntryExists) {
                // Ignore if both players have already been reported as a duplicate
                return;
              }

              // match found
              duplicatePlayers.push({
                name1 : p1.name,
                name2 : p2.name,
                discordId : serverPlayer1?.discordId || serverPlayer2?.discordId || null,
                leaderboard: keys[mode]
              });
            }
          });
        });
      }
    }
  }

  return duplicatePlayers;
}

module.exports = findDuplicateLeaderboardPlayers;
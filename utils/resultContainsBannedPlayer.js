const { Player } = require("../db/models/player");
const { RankedBan } = require("../db/models/ranked_ban");
const { parseData } = require('../table');

/**
 * Checks if a score table contains a banned player
 * @param {String} result 
 * @returns {Boolean}
 */
async function resultContainsBannedPlayer(result) {
  const data = parseData(result);
  const rankedBans = await RankedBan.find();

  let resultContainsBannedPlayer = false;

  /**
   * if the score table is invalid we just search for the ranked name
   * of a banned player within the result
   * this might potentially lead to false positives though ...
   */
  if (data.clans.length === 0) {
    for (const rankedBan of rankedBans) {
      const player = await Player.findOne({ discordId: rankedBan.discordId });

      if (!player || !player.rankedName) {
        continue;
      }

      if (result.indexOf(player.rankedName) !== -1) {
        resultContainsBannedPlayer = true;
        break;
      }
    }
  } else {
    for (const clan of data.clans) {
      for (const clanPlayer of clan.players) {
        const player = await Player.findOne({ rankedName: clanPlayer.name });
  
        if (!player) {
          continue;
        }
  
        const rankedBan = rankedBans.find((r) => r.discordId === player.discordId);
  
        if (!rankedBan) {
          continue;
        }
  
        resultContainsBannedPlayer = true;
        break;
      }
    }
  }

  return resultContainsBannedPlayer;
}

module.exports = resultContainsBannedPlayer;
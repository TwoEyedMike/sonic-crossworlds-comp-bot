const {
  RACE_ITEMS_FFA,
  RACE_ITEMS_DUOS,
} = require('../db/models/lobby');

/**
 * Returns a player's superscore
 * @param rank
 * @param baseRank
 * @returns {number}
 */
function calculateSuperScore(rank, baseRank = 500) {
  let itemSolosRank = rank[RACE_ITEMS_FFA].rank || baseRank;
  let itemTeamsRank = rank[RACE_ITEMS_DUOS].rank || baseRank;

  itemSolosRank = parseInt(itemSolosRank, 10);
  itemTeamsRank = parseInt(itemTeamsRank, 10);

  // eslint-disable-next-line max-len
  return Math.ceil((itemSolosRank + itemTeamsRank) / 2);
}

module.exports = calculateSuperScore;

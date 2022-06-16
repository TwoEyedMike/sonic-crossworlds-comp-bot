const axios = require('axios');
const config = require('../config');

/**
 * Returns the request body used for fetching data from lorenzi
 * @param String teamId 
 * @returns String
 */
function getRequest(teamId) {
  return `{
    team(teamId: "${teamId}")
      {
        id, kind, name, tag, iconSrc, flag, gamePreset, ownerIds, updaterIds, createDate, modifyDate, activityDate, wins, draws, losses, baseWins, baseDraws, baseLosses, ratingScheme, ratingMin, tiers { name, lowerBound, color }, ratingElo { initial, scalingFactors }, ratingMk8dxMmr { initial, scalingFactors, baselines }, matchCount, playerCount,
        players { name, ranking, maxRanking, minRanking, wins, losses, playedMatchCount, firstActivityDate, lastActivityDate, rating, ratingGain, maxRating, minRating, maxRatingGain, maxRatingLoss, points, maxPointsGain }
      }
  }`;
}

/**
 * Fetches data from a lorenzi leaderboard and returns a request promise
 * @param String teamId 
 * @returns String
 */
function getLorenziBoardData(teamId) {
  return axios.post(config.lorenzi_api_url, getRequest(teamId), { headers: { 'Content-Type': 'text/plain' } });
}

module.exports = getLorenziBoardData;
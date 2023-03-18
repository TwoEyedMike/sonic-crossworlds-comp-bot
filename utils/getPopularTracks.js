const fs = require('fs');
const config = require('../config');
const { Player } = require('../db/models/player');

/**
 * Calculates the popularity of tracks
 * @returns {Array}
 */
async function calculateTrackPopularity() {
  const players = await Player.find();
  const trackPopularity = {};

  for (const player in players) {
    const favTrack = players[player].favTrack;
  
    if (!favTrack) {
      continue;
    }
  
    if (!trackPopularity[favTrack]) {
      trackPopularity[favTrack] = 1;
    } else {
      trackPopularity[favTrack] += 1;
    }
  }

  /**
   * Fill up the track popularity with tracks that are not set to anyone's favorite
   * Otherwise in an empty database the set would be empty
   */
  fs.readFile(config.files.tracks_file, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const tracks = data.trim().split('\n');
    tracks.push('Retro Stadium');
  
    for (const track in tracks) {
      if (!trackPopularity[tracks[track]]) {
        trackPopularity[tracks[track]] = 0;
      }
    }
  });

  return trackPopularity;
}

/**
 * Gets an amount of popular tracks
 * @param {Number} amount
 * @returns {Array}
 */
async function getPopularTracks(amount = null) {
  const trackPopularity = await calculateTrackPopularity();

  let popularTracks = Object.keys(trackPopularity).sort((a, b) => trackPopularity[b] - trackPopularity[a]);

  if (amount !== null) {
    popularTracks = popularTracks.slice(0, amount);
  }

  return popularTracks;
}

/**
 * Gets an amount of unpopular tracks
 * @param {Number} amount
 * @returns {Array}
 */
async function getUnpopularTracks(amount = null) {
  const trackPopularity = await calculateTrackPopularity();

  let unpopularTracks = Object.keys(trackPopularity).sort((a, b) => trackPopularity[a] - trackPopularity[b]);

  if (amount !== null) {
    unpopularTracks = unpopularTracks.slice(0, amount);
  }

  return unpopularTracks;
}

module.exports.getPopularTracks = getPopularTracks;
module.exports.getUnpopularTracks = getUnpopularTracks;
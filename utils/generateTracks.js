const { 
  TRACK_OPTION_POPULAR, 
  TRACK_OPTION_UNPOPULAR
} = require('../db/models/lobby');

const shuffleArray = require('./shuffleArray');
const { 
  getPopularTracks, 
  getUnpopularTracks
} = require('../utils/getPopularTracks');

/**
 * Removes banned tracks from the track pool
 * @param pool
 * @param doc
 * @returns array
 */
function removeBannedTracks(pool, doc) {
  const bannedTracks = doc.getBannedTracks();
  return pool.filter((t) => !bannedTracks.includes(t));
}

/**
 * Generates tracks from pools
 * @param doc
 * @returns Promise
 */
async function generateTracks(doc) {
  let pools = doc.getTrackPools();

  if (![TRACK_OPTION_POPULAR, TRACK_OPTION_UNPOPULAR].includes(doc.trackOption) && pools.length <= 0) {
    return ['-'];
  }

  if (doc.trackOption === TRACK_OPTION_POPULAR) {
    pools = [await getPopularTracks(12)];
  }

  if (doc.trackOption === TRACK_OPTION_UNPOPULAR) {
    pools = [await getUnpopularTracks(12)];
  }

  let maps = [];
  const tmpPools = [...pools];

  if (!doc.isIronMan()) {
    if (tmpPools.length > 1) {
      const perPool = Math.floor(doc.trackCount / tmpPools.length);
      let remainder = doc.trackCount % tmpPools.length;

      tmpPools.forEach((p, i) => {
        p = removeBannedTracks(p, doc);
        if (p.length <= 0) {
          // eslint-disable-next-line no-plusplus
          remainder += perPool;
          return;
        }

        for (let x = 0; x < perPool; x += 1) {
          const trackIndex = Math.floor(Math.random() * p.length);

          maps.push(p[trackIndex]);
          p.splice(trackIndex, 1);
        }

        tmpPools[i] = p;
      });

      for (let x = 0; x < remainder; x += 1) {
        const poolIndex = Math.floor(Math.random() * tmpPools.length);

        const randomPool = removeBannedTracks(tmpPools[poolIndex], doc);
        if (randomPool.length <= 0) {
          x -= 1;

          // eslint-disable-next-line no-continue
          continue;
        }

        const trackIndex = Math.floor(Math.random() * randomPool.length);

        maps.push(randomPool[trackIndex]);
        tmpPools[poolIndex].splice(trackIndex, 1);
        tmpPools.splice(poolIndex, 1);
      }
    } else {
      const pool = removeBannedTracks(tmpPools[0], doc);
      const trackCount = (doc.trackCount > pool.length ? pool.length : doc.trackCount);

      for (let i = 0; i < trackCount; i += 1) {
        const trackIndex = Math.floor(Math.random() * pool.length);

        maps.push(pool[trackIndex]);
        pool.splice(trackIndex, 1);
      }
    }
  } else {
    maps = tmpPools[0];
  }

  maps = maps.map((m) => {
    if (m === 'Turbo Track' && Math.random() > 0.5) {
      m = 'Retro Stadium';
    }

    return m;
  });

  return shuffleArray(maps);
}

module.exports = generateTracks;

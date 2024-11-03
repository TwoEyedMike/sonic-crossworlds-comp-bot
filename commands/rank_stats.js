const config = require('../config');
const { Player } = require("../db/models/player");
const {
  RACE_ITEMS_FFA,
  RACE_ITEMS_DUOS,
  RACE_ITEMLESS_FFA,
  BATTLE_FFA,
} = require("../db/models/lobby");
const { Rank } = require("../db/models/rank");

function getRankingRating(rank) {
  let rating = parseInt(rank, 10);

  if (Number.isNaN(rating)) {
    rating = '-';
  }

  return rating;
}

function getEmbed(rankedName, gameModeName, rank) {
  const firstActivity = new Date(rank.firstActivity * 1000);
  const lastActivity = new Date(rank.lastActivity * 1000);

  const averageMMRGain = ((rank.rank - 1200) / rank.playedMatches).toFixed(1);
  const winQuota = (rank.wins / rank.playedMatches * 100).toFixed(2);

  return {
    "author": {
      "name": `${rankedName}'s ranked statistics [${gameModeName}]`
    },
    "color": config.default_embed_color,
    "timestamp": Date.now(),
    "fields": [
      {
        "name": ":checkered_flag: **Ranking**",
        "value": `**Current Position**: #${rank.position + 1}\n**Highest Position**: #${rank.minPosition + 1}\n**Lowest Position**: #${rank.maxPosition + 1}`,
        "inline": true
      },
      {
        "name": ":race_car: **Activity**",
        "value": `**First Match**: ${firstActivity.toLocaleString()}\n**Latest Match**: ${lastActivity.toLocaleString()}`,
        "inline": true
      },
      {
        "name": '\u200B',
        "value": '\u200B'
      },
      {
        "name": ":chart_with_upwards_trend: **MMR**",
        "value": `**Current MMR**: ${getRankingRating(rank.rank)}\n**Highest MMR**: ${getRankingRating(rank.maxRank)}\n**Lowest MMR**: ${getRankingRating(rank.minRank)}\n**Highest MMR Gain**: ${rank.maxRankGain}\n**Highest MMR Loss**: ${rank.maxRankLoss}\n**Average MMR Gain**: ${averageMMRGain}`,
        "inline": true
      },
      {
        "name": ":video_game: **Games**",
        "value": `**Races played**: ${rank.playedMatches}\n**Wins**: ${rank.wins}\n**Losses**: ${rank.losses}\n**Win quota**: ${winQuota}%`,
        "inline": true
      }
    ]
  }
}

module.exports = {
  name: 'rank_stats',
  description: 'Check detailed rank stats',
  guildOnly: true,
  cooldown: 30,
  // eslint-disable-next-line consistent-return
  async execute(message, args) {
    let rankedName;

    const user = message.mentions.users.first();
    if (!user) {
      if (args.length === 0) {
        const player = await Player.findOne({discordId: message.author.id});

        if (!player) {
          return message.channel.warn('You have not played any ranked matches yet.');
        }

        rankedName = player.rankedName || '-';
      } else {
        rankedName = args[0];
      }
    } else {
      const player = await Player.findOne({discordId: user.id});

      if (!player) {
        return message.channel.warn(`<@!${user.id}> has not played any ranked matches yet.`);
      }

      rankedName = player.rankedName || '-';
    }

    const gameModes = [
      {
        key: RACE_ITEMS_FFA,
        name: 'Item Solos Racing',
      },
      {
        key: RACE_ITEMS_DUOS,
        name: 'Item Teams Racing',
      },
      {
        key: RACE_ITEMLESS_FFA,
        name: 'Itemless Racing',
        description: null,
      },
      {
        key: BATTLE_FFA,
        name: 'Battle Mode',
      }
    ];

    const choice = await message.channel.awaitMenuChoice('Please select a leaderboard.', message.author.id, gameModes, 1, null);
    if (!choice) {
      return message.channel.error('Invalid leaderboard choice.');
    }

    const rank = await Rank.findOne({ name: rankedName });
    if (!rank) {
      return message.channel.warn(`${rankedName} has not played any ranked matches yet.`);
    }

    const gameModeRank = rank[choice];

    if (!gameModeRank.rank) {
      return message.channel.warn(`${rankedName} has not played any ranked matches in this game mode yet.`);
    }

    const gameMode = gameModes.find((gm) => gm.key === choice);

    const embed = getEmbed(rankedName, gameMode.name, gameModeRank);
    message.channel.send({ embed });
  }
};
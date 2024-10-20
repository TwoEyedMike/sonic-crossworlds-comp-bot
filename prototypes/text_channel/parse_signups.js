const { TextChannel } = require('discord.js');
const { parse, parsers } = require('../../utils/signups_parsers');
const { Player } = require("../../db/models/player");

/**
 * Parses signups of a channel
 * @param doc
 * @returns {Promise<{hosts: number, count: number, rows: *[]}>}
 */
// eslint-disable-next-line func-names
TextChannel.prototype.parseSignups = function (doc) {
  const parser = parsers[doc.parser];

  const separator = ',';
  let firstRow;
  const output = [];

  return this.fetchMessages(500).then(async (messages) => {
    let count = 0;
    let hosts = 0;

    const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
    for (const m of sortedMessages) {
      if (m.type === 'PINS_ADD' || m.author.bot) {
        continue;
      }

      count += 1;

      const data = parse(m, parser.fields);

      if (data.host) {
        hosts += 1;
      }

      data.valid = !data.errors.length;
      delete data.errors;

      if (!firstRow) {
        /* The ranked name is added on top of every signups parser */
        firstRow = ['#', ...Object.keys(data), 'rankedName'];
      }

      const player = await Player.findOne({ discordId: data.authorId });
      const rankedName = player && player.rankedName ? player.rankedName : '-';

      const row = [count, ...Object.values(data), rankedName];
      output.push(row.join(separator));

      data.createdAt = m.createdTimestamp;
    }

    output.unshift(firstRow);

    return { count, hosts, rows: output };
  });
};

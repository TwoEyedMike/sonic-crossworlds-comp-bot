const { TextChannel } = require('discord.js');

/**
 * Offers a csv file download
 * @param Array header 
 * @param Array rows 
 * @param String fileName
 * @param String separator 
 */
TextChannel.prototype.offerCsvDownload = function (header, rows, fileName = 'download.csv', separator = ',') {
  if (header.length === 0 && rows.length === 0) {
    return this.warn('File header and rows are empty. No csv file will be created.');
  }

  let fileContent = [header.join(separator)];
  rows.forEach((row) => {
    fileContent.push(row.join(separator));
  });

  let text = fileContent.join('\n');

  this.send({
    files: [{
      attachment: Buffer.from(text, 'utf-8'),
      name: fileName,
    }]
  });
}

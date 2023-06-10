const { User } = require('discord.js');

/**
 * Checks if a user has a new username 
 * @returns {Boolean}
 */
User.prototype.hasNewUsername = function () {
  return this.discriminator === '0';
}
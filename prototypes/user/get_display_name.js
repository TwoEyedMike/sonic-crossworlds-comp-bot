const { User } = require('discord.js');

/**
 * Gets the display name for the user (either with discriminator or without if it's a new username)
 * @returns {String}
 */
User.prototype.getDisplayName = function () {
  if (this.hasNewUsername()) {
    /* user has a new username */
    return this.username;
  }

  return `${this.username}#${this.discriminator}`;
}

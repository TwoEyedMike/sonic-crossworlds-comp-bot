const {User} = require('discord.js');

/**
 * Gets the avatar URL for the user
 * @returns {String}
 */
User.prototype.getAvatarUrl = function () {
  if (this.avatar) {
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
  }

  return this.defaultAvatarURL;
}
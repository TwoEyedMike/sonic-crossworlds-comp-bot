/**
 * Checks if a message contains a discord invite link
 */
function messageContainsDiscordInviteLink(message) {
	const discordInviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
	return discordInviteRegex.test(message);
}

module.exports = messageContainsDiscordInviteLink;

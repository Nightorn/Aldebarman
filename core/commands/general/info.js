const { MessageEmbed, version } = require("discord.js");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "info",
			description: "Displays informations about Aldebarman"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message) {
		const embed = new MessageEmbed()
			.setAuthor(`${bot.user.username} v${bot.version}`, bot.user.avatarURL())
			.addField(
				"Statistics",
				`Playing **here exclusively**\nWatching **${Number.formatNumber(bot.channels.size)} channels**\nListening to **${Number.formatNumber(bot.users.size)} members**`,
				true
			)
			.addField(
				"Powered by",
				`VPS Host **DigitalOcean**\nEnvironment **Node.js** ${process.version}\nAPI Library **discord.js** v${version}`,
				true
			)
			.setThumbnail(bot.user.avatarURL())
			.setColor(message.guild.me.displayColor);
		message.channel.send({ embed });
	}
};

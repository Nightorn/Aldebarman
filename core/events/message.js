const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message) => {
	if (!message.guild) return;

	if (message.author.bot) return;
	const prefix = ";";
	if (message.content.indexOf(prefix) !== 0) return;
	if (message.content.slice(prefix.length)[0] === " ") return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	try {
		const sliced = command.slice(1);
		if (command.indexOf("?") === 0) {
			message.channel.send({
				embed: bot.commands.getHelp(sliced, prefix)
			});
		} else if (command.indexOf("#") === 0) {
			try {
				bot.commands.bypassRun(sliced, message);
			} catch (err) {
				if (err.message === "INVALID_COMMAND") return;
				if (err.message === "UNALLOWED_ADMIN_BYPASS") {
					const embed = new MessageEmbed()
						.setTitle("You are not allowed to use this.")
						.setDescription(
							"By using `#`, you are trying to bypass Discord permissions requirements and other checks, which is only allowed for Aldebarman Administrators."
						)
						.setFooter(message.author.username, message.author.avatarURL())
						.setColor("RED");
					message.channel.send({ embed });
				} else {
					console.error(err);
				}
			}
		} else {
			bot.commands.execute(command, message);
		}
		console.log(
			`\x1b[34m- COMMAND: ${command} | USER: ${message.author.tag} (${
				message.author.id
			}) | ARGS: ${args.join(" ") || "None"}\x1b[0m`
		);
	} catch (err) {
		if (err.message === "INVALID_PERMISSIONS") {
			const embed = new MessageEmbed()
				.setTitle("You are not allowed to use this.")
				.setDescription(`This command requires permissions that you do not currently have. Please check \`${prefix}?${command}\` for more informations about the requirements to use this command.`)
				.setFooter(message.author.username, message.author.avatarURL())
				.setColor("RED");
			message.channel.send({ embed });
		} else if (err.message === "NOT_NSFW_CHANNEL") {
			const embed = new MessageEmbed()
				.setTitle("You are using this command incorrectly.")
				.setDescription(
					"As this command shows NSFW content, you need to use this command in a NSFW channel."
				)
				.setFooter(message.author.username, message.author.avatarURL())
				.setColor("RED");
			message.channel.send({ embed });
		} else if (err.message !== "INVALID_COMMAND") {
			console.error(err);
		}
	}
};

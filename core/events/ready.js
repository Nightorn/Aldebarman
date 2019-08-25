const { MessageEmbed } = require("discord.js");

exports.run = client => {
	console.log(
		`\x1b[36m# ${client.user.username} has started!${
			client.debugMode ? " The developer mode has been enabled." : ""
		}\x1b[0m`
	);
	console.log(
		`\x1b[36m# ${client.users.size} users, ${client.channels.size} channels, ${
			client.guilds.size
		} servers, ${client.commands.commands.size} commands\x1b[0m`
	);

	const parseText = value => {
		let text = value;
		text = text.replace("{NSERVERS}", Number.formatNumber(client.guilds.size));
		text = text.replace("{NUSERS}", Number.formatNumber(client.users.size));
		text = text.replace("{VERSION}", client.version);
		return text;
	};

	client.user.setActivity("for a few seconds now");
	const { presence } = client.config;
	setInterval(() => {
		const selected = presence[Math.floor(Math.random() * presence.length)];
		client.user.setActivity(parseText(selected.text), { type: selected.type });
	}, 30000);
};

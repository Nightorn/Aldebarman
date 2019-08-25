const { Client, MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports.Command = class Command {
	/**
   * Command abstract class, extend it to build a command
   * @param {*} client Client
   * @param {object} metadata Command Metadata
   * @param {string} metadata.name Name
   * @param {string} metadata.description Description
   * @param {string} metadata.usage Usage
   * @param {string} metadata.example Example
   * @param {string[]} metadata.aliases Aliases
   * @param {object} metadata.cooldown Cooldown Metadata
   * @param {string} metadata.cooldown.group Group
   * @param {number} metadata.cooldown.amount Amount
   * @param {number} metadata.cooldown.resetInterval Reset Interval
   * @param {object} metadata.perms Required Permissions
   * @param {string[]} metadata.perms.discord Discord required permissions
   * @param {string[]} metadata.perms.aldebarman Aldebarman required permissions
   */
	constructor(client, metadata) {
		if (this.constructor === "Command") {
			throw new TypeError(
				"Command is an abstract class and therefore cannot be instantiated."
			);
		}
		if (!(client instanceof Client)) { throw new TypeError("The specified Client is invalid"); }
		if (metadata === undefined) throw new TypeError("The metadata are invalid");
		if (metadata.name === undefined || metadata.description === undefined) { throw new TypeError("The metadata are invalid"); }
		this.perms = {
			discord: [],
			aldebarman: []
		};
		if (metadata.perms !== undefined) {
			if (metadata.perms.discord !== undefined) {
				if (!(metadata.perms.discord instanceof Array)) { throw new TypeError("The Discord permissions metadata are invalid"); } else this.perms.discord = metadata.perms.discord;
			}
			if (metadata.perms.aldebarman !== undefined) {
				if (!(metadata.perms.aldebarman instanceof Array)) { throw new TypeError("The Aldebarman permissions metadata are invalid"); } else this.perms.aldebarman = metadata.perms.aldebarman;
			}
		}
		this.aliases = metadata.aliases || [];
		this.category = "General";
		this.cooldown = metadata.cooldown || {
			amount: 1,
			resetInterval: 0
		};
		this.cooldown.fixed = Math.ceil(
			this.cooldown.resetInterval / this.cooldown.amount / 1000
		);
		this.color = "BLUE";
		this.client = client;
		this.example = !metadata.example ? "" : `\`${metadata.example}\``;
		this.hidden = false;
		this.metadata = metadata;
		this.name = metadata.name;
		this.subcommands = new Map();
		this.usage = !metadata.usage ? "" : `\`${metadata.usage}\``;
	}

	/**
   * Checks if the context of execution is valid
   * @param {*} message Message
   */
	permsCheck(message) {
		let check = true;
		if (this.perms.discord !== undefined) {
			this.perms.discord.forEach(perm => {
				if (!message.member.permissions.has(perm)) check = false;
			});
		}
		if (this.perms.aldebarman !== undefined) {
			this.perms.aldebarman.forEach(perm => {
				if (!message.author.hasPerm(perm)) check = false;
			});
		}
		return check;
	}

	check(message) {
		return this.permsCheck(message);
	}

	/**
   * Executes the command
   * @param {} msg Message object
   */
	execute(message) {
		const args = message.content.split(" ");
		args.shift();
		if (this.check(message)) {
			return this.run(this.client, message, args);
		}
		throw new Error("INVALID_PERMISSIONS");
	}

	checkSubcommands(path) {
		path = `${path.replace(".js", "")}/`;
		if (fs.existsSync(path)) {
			fs.readdir(path, (err, files) => {
				files.forEach(file => {
					try {
						// eslint-disable-next-line import/no-dynamic-require, global-require
						const Structure = require(`../../../${path}${file}`);
						const command = new Structure(this.client);
						this.subcommands.set(command.name, command);
					} catch (error) {
						console.log(`\x1b[31m${path}${file} is seen as a subcommand but is invalid.\x1b[0m`);
					}
				});
			});
		}
	}

	// eslint-disable-next-line class-methods-use-this
	registerCheck() {
		return true;
	}

	toHelpEmbed(command, prefix = "&") {
		const embed = new MessageEmbed()
			.setAuthor(
				`Aldebarman  |  Command Help  |  ${this.name}`,
				this.client.user.avatarURL()
			)
			.setDescription(this.metadata.description)
			.addField("Category", this.category, true)
			.addField("Usage", `${prefix}${command} ${this.usage}`, true)
			.addField("Example", `${prefix}${command} ${this.example}`, true)
			.setColor("BLUE");
		if (this.aliases.length > 0) { embed.addField("Aliases", this.aliases.join(", "), true); }
		if (this.cooldown.fixed > 0) { embed.addField("Cooldown", `${Math.ceil(this.cooldown.fixed)}s`, true); }
		if (this.cooldown.group !== undefined) { embed.addField("CCG", this.cooldown.group, true); }
		if (this.args !== undefined) embed.addField("Arguments", this.args, true);
		if (this.perms.discord.length > 0) { embed.addField("Discord Perms", this.perms.discord.join(", "), true); }
		if (this.perms.aldebarman.length > 0) { embed.addField("Aldebarman Perms", this.perms.aldebarman.join(", "), true); }
		return embed;
	}

	get shortDesc() {
		const desc = this.metadata.description;
		if (desc.length > 60)
			return `${this.metadata.description.substr(0, 60)}...`;
		return desc;
	}
};

module.exports.Embed = class NSFWEmbed extends MessageEmbed {
	constructor(command) {
		super();
		this.setAuthor(
			`${command.category}  |  ${command.name}`,
			command.client.user.avatarURL()
		);
		this.setColor(command.color);
	}
};

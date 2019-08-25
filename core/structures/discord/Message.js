const { Collection } = require("discord.js");

module.exports = BaseMessage => class Message extends BaseMessage {
	constructor(client, data, channel) {
		super(client, data, channel);
	}

	get userMentions() {
		if (this.guild === null) return new Collection();
		if (this.guild.members === undefined) return new Collection();
		return new Collection(
			this.guild.members.entries()
		).filter(member => {
			const results = this.content.match(/(<@)([0-9]{16,19})>/g);
			return results !== null ? results.includes(`<@${member.id}>`) : false;
		});
	}

	get args() {
		const args = this.content.split(" ");
		args.shift();
		return args;
	}
};

const { Command } = require("./GeneralCategory");

module.exports.Command = class DeveloperCategory extends Command {
	constructor(client, metadata) {
		super(client, {
			...metadata,
			perms: metadata.perms === undefined
				? { aldebarman: ["DEVELOPER"] }
				: { ...metadata.perms }
		});
		this.category = "Developer";
	}
};

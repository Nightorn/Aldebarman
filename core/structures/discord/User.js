const staffRoles = require("../../../assets/staffRoles.json");

module.exports = BaseUser => class User extends BaseUser {
	constructor(client, data) {
		super(client, data);
	}

	checkPerms(perm) {
		if (this.asBotStaff === null) return false;
		if (this.asBotStaff.acknowledgements.includes("ADMIN")) return true;
		if (perm === "MODERATOR") return this.asBotStaff.acknowledgements.includes("MODERATOR");
		return false;
	}

	hasPerm(perm) {
		const guild = this.client.guilds.get("461792163525689345");
		if (guild === undefined) return false;
		const member = guild.members.get(this.id);
		if (member === undefined) return false;
		const { roles } = member;
		const perms = [];
		let rank = 99;
		if (roles !== undefined) {
			roles.each(role => {
				if (Object.keys(staffRoles).includes(role.id)) {
					perms.push(staffRoles[role.id].name);
					const permRank = staffRoles[role.id].rank;
					if (rank > permRank) rank = permRank;
				}
			});
			Object.values(staffRoles).forEach(data => {
				if (data.rank >= rank && !perms.includes(data.name))
					perms.push(data.name);
			});
		}
		return perms.includes(perm);
	}

	get highestPerm() {
		let rank = 99;
		let perm = null;
		const guild = this.client.guilds.get("461792163525689345");
		if (guild === undefined) return null;
		const member = guild.members.get(this.id);
		if (member === undefined) return null;
		const { roles } = member;
		if (roles !== undefined) {
			roles.each(role => {
				for (const [id, data] of Object.entries(staffRoles)) {
					if (role.id === id) {
						if (data.rank < rank) {
							// eslint-disable-next-line prefer-destructuring
							rank = data.rank;
							perm = data.name;
						}
					}
				}
			});
		}
		return perm;
	}
};

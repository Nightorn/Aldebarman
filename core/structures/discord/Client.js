const { Client } = require("discord.js");
const fs = require("fs");
const CommandHandler = require("../categories/Handler");
const config = require("../../../config/config.json");
const presence = require("../../../config/presence.json");
const packageFile = require("../../../package.json");

module.exports = class Aldebarman extends Client {
	constructor() {
		super({
			disabledEvents: ["TYPING_START"],
			messageCacheMaxSize: 10,
			messageCacheLifetime: 1800,
			messageSweepInterval: 300
		});
		this.started = Date.now();
		this.config = {
			...config,
			presence
		};
		this.commands = new CommandHandler(this);
		this.debugMode = process.argv[2] === "dev";
		this.login(this.debugMode ? this.config.tokendev : this.config.token);
		this.stats = {
			commands: {
				total: 0,
				all: {}
			},
			users: {
				total: 0,
				all: {}
			},
			servers: {
				total: 0,
				all: {}
			}
		};
		this.version = packageFile.version;
		if (process.argv[3] !== undefined && this.debugMode) {
			this.config.prefix = process.argv[3];
		}
		for (const [command] of this.commands.commands)
			this.stats.commands.all[command] = {};

		fs.readdir("./core/events/", (err, files) => {
			if (err) throw err;
			files.forEach(file => {
				const eventFunction = require(`../../events/${file}`);
				const eventName = file.split(".")[0];
				this.on(eventName, (...args) => eventFunction.run(this, ...args));
			});
		});
	}
};

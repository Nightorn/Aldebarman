const { MessageEmbed } = require("discord.js");
exports.run = (bot, member) => {
    const embed = new MessageEmbed()
        .setAuthor("Modlogging  |  Someone left")
        .setTitle(`${member.user.tag}`)
        .setDescription(`**ID** ${member.user.id}`)
        .setThumbnail(member.user.avatarURL())
        .setColor("ORANGE");
    bot.guilds.get("461792163525689345").channels
        .get("490532994755461131").send({ embed });
};
exports.run = (bot, member) => {
    bot.guilds.get("461792163525689345").channels.get("461792163525689347")
        .send(`Welcome **${member.user.username}** to this server, have a good stay!\nPlease read <#461796105970253825>, and if you have any question about the bot, make sure to ask in <#461792323454500864>!`);
    member.roles.add("461792898896232449");
};
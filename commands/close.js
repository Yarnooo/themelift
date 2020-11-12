const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    const categoryID = "719469933146406972";

    if (!message.member.hasPermission("SEND_MESSAGES")) return message.reply("Je hebt niet de juiste rechten!");

    if (message.channel.parentID == categoryID) {
        message.channel.delete();

        // create embed
        var embedCreateTicket = new discord.MessageEmbed()
            .setTitle("Ticket, " + message.channel.name)
            .setColor("#ff0000")
            .setDescription("De ticket is succesvol afgerond.\nGesloten door: " + message.author.username)
            .setFooter("De ticket is gesloten.")
            .setTimestamp()

        // channel voor logs
        var ticketChannel = message.member.guild.channels.cache.find(channel => channel.name === "ticket-logs");
        if (!ticketChannel) return message.reply("Het kanaal bestaat niet.");

        ticketChannel.send(embedCreateTicket);

    } else {

        message.channel.send("Je moet dit command uitvoeren in een ticket.");

    }

}

module.exports.help = {
    name: "close"
}
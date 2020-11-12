const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    const categoryID = "719469933146406972";

    var userName = message.author.username;
    var userDiscriminator = message.author.discriminator;

    var ticketBestaat = false;

    message.guild.channels.cache.forEach(channel => {

        if (channel.name == userName.toLowerCase() + "-" + userDiscriminator) {
            ticketBestaat = true;

            message.reply("❌ | Je hebt al een ticket!");

            return;
        }

    });

    if (ticketBestaat) return;

    var embed = new discord.MessageEmbed()
        .setTitle(`Hallo ${message.author.username},`)
        .setDescription("✅ | Je ticket is succesvol aangemaakt!")
        .setColor("#ff0000");

    message.channel.send(embed);

    message.guild.channels.create(userName.toLowerCase() + "-" + userDiscriminator, { type: 'text' }).then(
        (createdChannel) => {
            createdChannel.setParent(categoryID).then(
                (settedParent) => {

                    settedParent.updateOverwrite(message.guild.roles.cache.find(x => x.name === '@everyone'), {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    });

                    settedParent.updateOverwrite(message.guild.roles.cache.find(x => x.id === '722459793184522286'), {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        READ_MESSAGES: true,
                        CONNECT: true
                    });

                    settedParent.updateOverwrite(message.author.id, {
                        CREATE_INSTANT_INVITE: false,
                        READ_MESSAGES: true,
                        SEND_MESSAGES: true,
                        ATTACH_FILES: true,
                        CONNECT: true,
                        ADD_REACTIONS: true,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    });

                    var embedParent = new discord.MessageEmbed()
                        .setTitle(`Hallo ${message.author.username},`)
                        .setDescription("Zou je alvast kunnen uitleggen waar we je mee kunnen helpen? Dan komt ons Support team je zo snel mogelijk helpen!")
                        .setColor("#ff0000")

                    settedParent.send(embedParent);

                }
            ).catch(err => {
                message.channel.send("Er is iets fout gegaan!")
            });
        }
    ).catch(err => {
        message.channel.send("Er is iets fout gegaan!")
    });
}

module.exports.help = {
    name: "ticket"
}
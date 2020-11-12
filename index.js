const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const fs = require("fs");

const client = new discord.Client();
client.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if (jsFiles.length <= 0) {
        console.log("Kon geen files vinden");
        return;
    }

    jsFiles.forEach((f, i) => {

        var fileGet = require(`./commands/${f}`);
        console.log(`De file ${f} is geladen`);

        client.commands.set(fileGet.help.name, fileGet);

    })

});

const token = process.env.token;

client.on("guildMemberAdd", member => {

    var role = member.guild.roles.cache.get('703594390110601239');

    if (!role) return;

    member.roles.add(role);

})

client.on("ready", async () => {

    console.log(`${client.user.username} is online!`);
    client.user.setActivity("ThemeLift", { type: "LISTENING" })

});

client.on('guildMemberAdd', member => {

    const channel = member.guild.channels.cache.find(channel => channel.name === "welkom");
    if (!channel) return;

    channel.send(`Hey ${member}, en welkom in **ThemeLift**!🎉`)
});

client.on("message", async message => {

    if (message.author.bot) return;

    if (message.channel.type == "dm") return;

    var prefix = botConfig.prefix

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if(!message.content.startsWith(prefix)) return;

    var commands = client.commands.get(command.slice(prefix.length));

    if (commands) commands.run(client, message, arguments);

    if (command === `${prefix}kick`) {

        // !kick @spelerNaam redenen hier

        var args = message.content.slice(prefix.length).split(/ +/);

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Je hebt niet de juiste rechten!");

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Ik heb niet de juiste rechten!");

        if (!args[1]) return message.reply("Gebruik **!kick (gebruiker) (reden)**.");

        if (!args[2]) return message.reply("Je moet een reden geven!");

        var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

        var reason = args.slice(2).join(" ");

        if (!kickUser) return message.reply("Gebruiker niet gevonden!");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("**Na 30 seconden zijn deze knoppen niet meer te gebruiken.**")
            .setDescription(`Weet je zeker dat je ${kickUser} wilt kicken?`)
            .setFooter("YΛЯПӨӨӨ#1673 ©")
            .setTimestamp();

        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Gekickt: ** ${kickUser} (${kickUser.id})
            **Gekickt door:** ${message.author}
            **Reden:** ${reason}`);

        message.channel.send(embedPrompt).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {

                msg.delete();

                kickUser.kick(reason).catch(err => {
                    if (err) return message.reply("Er is iets fout gegaan!")
                });

                message.channel.send(embed);

            } else if (emoji === "❌") {

                msg.delete();

                message.reply("Kick is geannuleerd.").then(m => m.delete(5000));

            }

        })

    }

    if (command === `${prefix}ban`) {

        // !ban @spelerNaam redenen hier

        var args = message.content.slice(prefix.length).split(/ +/);

        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Je hebt niet de juiste rechten!");

        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("Ik heb niet de juiste rechten!");

        if (!args[1]) return message.reply("Gebruik **!ban (gebruiker) (reden)**.");

        if (!args[2]) return message.reply("Je moet een reden geven!");

        var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

        var reason = args.slice(2).join(" ");

        if (!banUser) return message.reply("Gebruiker niet gevonden!");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("**Na 30 seconden zijn deze knoppen niet meer te gebruiken.**")
            .setDescription(`Weet je zeker dat je ${banUser} wilt bannen?`)
            .setFooter("YΛЯПӨӨӨ#1673 ©")
            .setTimestamp();

        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Geband: ** ${banUser} (${banUser.id})
            **Geband door:** ${message.author}
            **Reden:** ${reason}`);

        message.channel.send(embedPrompt).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {

                msg.delete();

                banUser.ban(reason).catch(err => {
                    if (err) return message.reply("Er is iets fout gegaan!")
                });

                message.channel.send(embed);

            } else if (emoji === "❌") {

                msg.delete();

                message.reply("Ban is geannuleerd.").then(m => m.delete(5000));

            }

        })

    }

});

async function promptMessage(message, author, time, reactions) {

    time *= 1000;

    for (const reaction of reactions) {
        await message.react(reaction);
    }

    var filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
}

client.login(token).catch(err => console.log(err));
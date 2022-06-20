const client = require("../index");
const Settings = require("../configration/Settings.json");
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { red, green } = require("../configration/Emojis.json");
const tagliAlim = require("../schemas/tagliAlim");
const names = require("../schemas/names");
const staffRegData = require("../schemas/staffRegisteryData")
const botReq = require("../schemas/botRequirements");

client.on("userUpdate", async (oldUser, newUser) => {

    let guild = client.guilds.cache.get(Settings.GuildId);

    const req = await botReq.findOne({ guildId: Settings.GuildId }).clone();
    let ch = guild.channels.cache.get(req.TagLog);
    let member = guild.members.cache.get(oldUser.id);

    function emb(msg, detec) {
        let embed = new MessageEmbed()
        .setAuthor({ name: `${detec}`, iconURL: guild.iconURL({ dynamic: true }) })
        .setDescription(`${msg}`)
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}`  })
        ch.send({ embeds: [embed] });
    }

    if(oldUser.tag !== newUser.tag){
        if(!oldUser.tag.includes(`${Settings.EtiketTag}`) && newUser.tag.includes(`${Settings.EtiketTag}`)){
            await member.roles.add(req.TagRole);
            emb(`${member}, ${Settings.EtiketTag} tagımızı alarak aramıza katıldı!`, "Aramıza Katıldı")
        } else if(oldUser.tag.includes(`${Settings.EtiketTag}`) && !newUser.tag.includes(`${Settings.EtiketTag}`)){
            await member.roles.remove(req.TagRole);
            emb(`${member}, ${Settings.EtiketTag} tagımızı çıkardığı için aramızdan ayrıldı.`, "Aramızdan Ayrıldı")
        }

        if(!oldUser.tag.includes(`${Settings.Tag}`) && newUser.tag.includes(`${Settings.Tag}`)){
            await member.roles.add(req.TagRole);
            emb(`${member}, ${Settings.Tag} tagımızı alarak aramıza katıldı!`, "Aramıza Katıldı")
        } else if(oldUser.tag.includes(`${Settings.Tag}`) && !newUser.tag.includes(`${Settings.Tag}`)){
            await member.roles.remove(req.TagRole);
            emb(`${member}, ${Settings.Tag} tagımızı çıkardığı için aramızdan ayrıldı.`, "Aramızdan Ayrıldı")
        }
    }

});

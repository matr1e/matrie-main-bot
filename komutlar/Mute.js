const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const Settings = require("../configration/Settings.json");
const { red, green } = require("../configration/Emojis.json");
const tagliAlim = require("../schemas/tagliAlim");
const cezaData = require("../schemas/cezaData");
const names = require("../schemas/names");
const staffRegData = require("../schemas/staffRegisteryData")
const botReq = require("../schemas/botRequirements");
const ms = require("ms");


/* MIT License

Copyright (c) 2022 Matrié 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

exports.run = async (client, message, args) => {


    function embed(msg, decision, time) {
        const newemb = new MessageEmbed()
        .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
        .setDescription(`**${msg}**`)
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })
        if(decision === "green") message.react(green);
        if(decision === "red") message.react(red);
        if(!time) time = 7
        let times = time * 1000;
        message.channel.send({ embeds: [newemb] }).then(x => setTimeout(() => { x.delete() }, times));
      }

    const req = await botReq.findOne({ guildId: message.guild.id }).clone();
    let guild = client.guilds.cache.get(Settings.GuildId);
    let ch = message.guild.channels.cache.get(req.MuteLog);

    const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId("MUTE")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Lütfen verilecek cezayı seçiniz.")
        .addOptions([
            {
                label: "Ceza Süresi: 10 Dakika",
                description: "Ceza Sebebi: Kışkırtma, Troll, Hakaret, Dalga Geçme",
                value: "mfive"
            },
            {
                label: "Ceza Süresi: 15 Dakika",
                description: "Ceza Sebebi: Sunucuya, Yetkiliye, Hakaret, Dalga Geçme",
                value: "mfives"
            },
            {
                label: "Ceza Süresi: 20 dakika",
                description: "Ceza Sebebi: Ailevi Değerlere Küfür",
                value: "mtweny"
            },
            {
                label: "Ceza Süresi: 25 dakika",
                description: "Ceza Sebebi: Taciz (Sözlü, DM, Ses), Şahsa Yönelik Tehdit",
                value: "mtwenyfive"
            },
            {
                label: "Ceza Süresi: 30 dakika",
                description: "Ceza Sebebi: Irk, dil, siyasi, cinsiyetçi davranışlar.",
                value: "mthirty"
            }
        ])
    )

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    args = args.filter(a => a !== "" && a !== " ").splice(1);

    if(!req) return embed(`Database Ayarlanmamış. Lütfen geliştirici ile iletişime geçin!`)
    if(!req.Muted) return embed(`Roller ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);
    if(!req.MuteStaff) return embed(`Roller ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);
    if(!req.MuteLog) return embed(`Kanallar ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);

    if(!req.MuteStaff.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has("ADMINISTRATOR")) return embed(`Yeterli yetkiniz bulunmamakta.`, "red", 7);
    if(!member) return embed(`Lütfen bir üye etiketleyiniz.`, "red", 7);
    if(message.author.id === member.id) return embed(`Kendinize mute atamazsınız`, "red", 7);
    if(!member.manageable) return embed(`Böyle birisine mute atamıyorum.`, "red", 7);
    if(message.member.roles.highest.position <= member.roles.highest.position) return embed(`Seninle aynı veya yüksek yetkideki kişileri mute atamazsın!`, "red", 7);
 
    let chnl = client.channels.cache.get(req.MuteLog);

    let s = new MessageEmbed()
    .setAuthor({ name: member.displayName, iconURL: member.avatarURL({ dynamic: true }) })
    .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })

    s.setDescription(`**Lütfen \`30 saniye\` içerisinde verilecek cezayı seçiniz**`)
    let matr = await message.channel.send({ embeds: [s], components: [row] });

    let filter = button => button.member.id === message.author.id;
    let collector = matr.createMessageComponentCollector({ filter, time: 30000 })


    client.on("interactionCreate", async interaction => {
        if(interaction.isSelectMenu()){
            if(interaction.values[0] === "mfive") {
                member.roles.add(req.Muted);
                await cezaData.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { cezalar: { punish: "MUTE", reason: "Kışkırtma, Troll, Hakaret, Dalga Geçme", date: Date.now(), staff: message.author.id } } }, { upsert: true });      
                s.setDescription(`${member} adlı üye, ${message.author} tarafından "Kışkırtma, Troll, Hakaret, Dalga Geçme" sebebiyle \`10 dakika\` boyunca \`MUTE\` cezası aldı!`);                
                chnl.send({ embeds: [s] });

                setTimeout(() => {
                    s.setDescription(`${member} üyesinin cezası sona erdi`)
                    ch.send({ embeds: [s] })
                    member.roles.remove(req.Muted);
                }, 600000);
            }
            if(interaction.values[0] === "mfives") {
                member.roles.add(req.Muted);
                await cezaData.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { cezalar: { punish: "MUTE", reason: "Sunucuya, Yetkiliye, Hakaret, Dalga Geçme", date: Date.now(), staff: message.author.id } } }, { upsert: true });
                s.setDescription(`${member} adlı üye, ${message.author} tarafından "Sunucuya, Yetkiliye, Hakaret, Dalga Geçme" sebebiyle \`15 dakika\` boyunca \`MUTE\` cezası aldı!`);                
                chnl.send({ embeds: [s] });

                setTimeout(() => {
                    s.setDescription(`${member} üyesinin cezası sona erdi`)
                    ch.send({ embeds: [s] })
                    member.roles.remove(req.Muted);
                }, 900000);
            }
            if(interaction.values[0] === "mtweny") {
                member.roles.add(req.Muted);
                await cezaData.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { cezalar: { punish: "MUTE", reason: "Ailevi Değerlere Küfür", date: Date.now(), staff: message.author.id } } }, { upsert: true });                
                s.setDescription(`${member} adlı üye, ${message.author} tarafından "Ailevi Değerlere Küfür" sebebiyle \`20 dakika\` boyunca \`MUTE\` cezası aldı!`);                
                chnl.send({ embeds: [s] });

                setTimeout(() => {
                    s.setDescription(`${member} üyesinin cezası sona erdi`)
                    ch.send({ embeds: [s] })
                    member.roles.remove(req.Muted);
                }, 1200000);
            }
            if(interaction.values[0] === "mtwenyfive") {
                member.roles.add(req.Muted);
                await cezaData.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { cezalar: { punish: "MUTE", reason: "Taciz (Sözlü, DM, Ses), Şahsa Yönelik Tehdit", date: Date.now(), staff: message.author.id } } }, { upsert: true });
                
                s.setDescription(`${member} adlı üye, ${message.author} tarafından "Taciz (Sözlü, DM, Ses), Şahsa Yönelik Tehdit" sebebiyle \`25 dakika\` boyunca \`MUTE\` cezası aldı!`);                
                chnl.send({ embeds: [s] });

                setTimeout(() => {
                    s.setDescription(`${member} üyesinin cezası sona erdi`)
                    ch.send({ embeds: [s] })
                    member.roles.remove(req.Muted);
                }, 1500000);
            }
            if(interaction.values[0] === "mthirty") {
                member.roles.add(req.Muted);
                await cezaData.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { cezalar: { punish: "MUTE", reason: "Irk, dil, siyasi, cinsiyetçi davranış", date: Date.now(), staff: message.author.id } } }, { upsert: true });
                
                s.setDescription(`${member} adlı üye, ${message.author} tarafından "Irk, dil, siyasi, cinsiyetçi davranış" sebebiyle \`30 dakika\` boyunca \`MUTE\` cezası aldı!`);                
                chnl.send({ embeds: [s] });

                setTimeout(() => {
                    
                    s.setDescription(`${member} üyesinin cezası sona erdi`)
                    ch.send({ embeds: [s] })
                    member.roles.remove(req.Muted);
                }, 1800000);
            }
        }
    })


};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "mute"
};

/*.then(x => setTimeout(() => { x.delete() }, 7000)) */
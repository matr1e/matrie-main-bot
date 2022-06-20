const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
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
        if(!time) time = 7;
        let times = time * 1000;
        message.channel.send({ embeds: [newemb] }).then(x => setTimeout(() => { x.delete() }, times));
      }

    const req = await botReq.findOne({ guildId: message.guild.id }).clone();
    let guild = client.guilds.cache.get(Settings.GuildId);
    let ch = guild.channels.cache.get(req.JailLog);

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let jtime = args[1];
    let reason = args.slice(2).join(" ")

    if(!req.JailStaff.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has("ADMINISTRATOR")) return embed(`Yeterli yetkiniz bulunmamakta.`, "red", 7);
    if(!member) return embed(`Lütfen bir üye etiketleyiniz.`, "red", 7);
    if(message.author.id === member.id) return embed(`Kendinize jail atamazsınız`, "red", 7);
    if(!member.manageable) return embed(`Böyle birisine mute atamıyorum.`, "red", 7);
    if(message.member.roles.highest.position <= member.roles.highest.position) return embed(`Seninle aynı veya yüksek yetkideki kişilere jail atamazsın!`, "red", 7);
    if(!jtime) return embed(`Lütfen bir zaman giriniz!`, "red", 7);
    if(!reason) return embed(`Lütfen bir sebep belirtin!`, "red", 7);

    if(!req) return embed(`Database ayarlanmamış, Lütfen geliştirici ile iletişime geçin! ${Settings.Footer.map(x => `${x}`)}`)
    if(!req.JailStaff) return embed(`Roller ayarlanmamış, Lütfen geliştirici ile iletişime geçin! ${Settings.Footer.map(x => `${x}`)}`)
    if(!req.Jailed) return embed(`Roller ayarlanmamış, Lütfen geliştirici ile iletişime geçin! ${Settings.Footer.map(x => `${x}`)}`)
    if(!req.JailLog) return embed(`Kanallar ayarlanmamış. Lütfen geliştiriciye haber verin! ${Settings.Footer.map(x => `${x}`)}`)

    let s = new MessageEmbed()
    .setAuthor({ name: member.displayName, iconURL: member.avatarURL({ dynamic: true }) })
    .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })

    member.roles.set([req.Jailed]);
    embed(`${member} başarıyla ${message.author} tarafından, \`${jtime}\` süre boyunca \`${reason}\` sebebiyle *JAIL* cezası aldı!`);
    s.setDescription(`${member} başarıyla ${message.author} tarafından, \`${jtime}\` süre boyunca \`${reason}\` sebebiyle *JAIL* cezası aldı!`)
    await cezaData.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { cezalar: { punish: "JAIL", reason: reason, date: Date.now(), staff: message.author.id } } });
    ch.send({ embeds: [s] })

    setTimeout(() => {
        s.setDescription(`${member} üyesinin cezası sona erdi`)
        ch.send({ embeds: [s] })
        member.roles.set([req.Unregister]);
    }, ms(jtime));


};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "jail"
};

/*.then(x => setTimeout(() => { x.delete() }, 7000)) */
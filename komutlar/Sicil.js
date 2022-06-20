const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Settings = require("../configration/Settings.json");
const { red, green } = require("../configration/Emojis.json");
const tagliAlim = require("../schemas/tagliAlim");
const cezaData = require("../schemas/cezaData");
const staffRegData = require("../schemas/staffRegisteryData")
const botReq = require("../schemas/botRequirements");
const moment = require("moment");
require("moment-duration-format")

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
        let times = time * 1000;
        message.channel.send({ embeds: [newemb] }).then(x => setTimeout(() => { x.delete() }, times));
      }
    
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
        const req = await botReq.findOne({ guildId: message.guild.id }).clone();
    
        if(!req.BanStaff.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has("ADMINISTRATOR")) return embed(`Yeterli yetkiniz bulunmamakta.`, "red", 7);
        if(!member) return embed(`Bir kişi etiketlemelisiniz`, "red", 7);
        const data = await cezaData.findOne({ guildId: message.guild.id, uyeId: member.id });
        embed(`${member} üyesinin isim bilgileri: \n\n ${data ? data.cezalar.splice(0, 10).map((x, i) => `\`${i + 1}\` \`${x.punish}\` [${x.reason}] [<@${x.staff}>] \`${moment(x.date).format("LLL")}\``).join("\n") : "Sicil geçmişi yok gibi görünüyor"}`, "green", 7);

};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "sicil"
};

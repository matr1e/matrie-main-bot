const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Settings = require("../configration/Settings.json");
const { red, green } = require("../configration/Emojis.json");
const tagliAlim = require("../schemas/tagliAlim");
const names = require("../schemas/names");
const staffRegData = require("../schemas/staffRegisteryData")
const botReq = require("../schemas/botRequirements");


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

    if(!req) return embed(`Database ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);
    if(!message.member.roles.cache.has("ADMINISTRATOR")) return embed(`Yeterli yetkiniz bulunmamakta.`);
    
    let row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId("PREW")
        .setLabel("Önceki")
        .setStyle("PRIMARY"),

        new MessageButton()
        .setCustomId("NEXT")
        .setLabel("Sonraki")
        .setStyle("SECONDARY")
    )

    let aktifyt = message.guild.members.cache.filter(s => s.roles.cache.has("984101332329852930")).filter(s => s.presence && s.presence.status !== "offline").map(s => `<@${s.id}>`).join("\n")
    let sesteolan = message.guild.members.cache.filter(s => s.roles.cache.has("984101332329852930")).filter(s => !s.voice.channel).map(s => s).join("\n")
    
    
    let aktf = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setDescription(`Şu anda aktif olan yetkililer: \n ${aktifyt}`)
    .setFooter({ text: `Matrié <3` })

    let sesaktif = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setDescription(`Şu anda seste olmayan yetkililer: \n ${sesteolan}`)
    .setFooter({ text: `Matrié <3` })

    let msg = await message.reply({ embeds: [aktf], components: [row] });
    let filter = button => button.member.id === message.author.id;
    const collector = msg.createMessageComponentCollentor({ filter: filter, time: 90000 });

    collector.on("collect", async button => {
        if(button.customId === "PREW"){
            msg.edit({ embeds: [aktf] });
        }
        if(button.customId === "NEXT"){
            msg.edit({ embeds: [sesaktif] })
        }
    })
};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "ytsay"
};

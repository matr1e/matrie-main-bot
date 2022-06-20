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


    const matr = await botReq.findOne({ guildId: message.guild.id }).clone();


    let row = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId("STAFF")
      .setLabel("Yetkili Rolleri")
      .setStyle("SUCCESS"),

      new MessageButton()
      .setCustomId("REGISTERY")
      .setLabel("Kayıt Rolleri")
      .setStyle("PRIMARY"),

      new MessageButton()
      .setCustomId("CEZALI")
      .setLabel("Cezalı Rolleri")
      .setStyle("DANGER"),

      new MessageButton()
      .setCustomId("CHANNELS")
      .setLabel("Kanallar")
      .setStyle("SECONDARY")
    )

    if(!Settings.Footer.some(id => message.author.id === id)) return embed(`Yeterli yetkiniz bulunmamakta.`)

    let emb = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setDescription(`Lütfen kontrol için aşağıdaki butonlara basınız.`)
    .setFooter({ text: `Matrié <3` })

    let s = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true }) })
    .addField(`Register Staff`, `${matr ? (matr.RegisterStaff ? matr.RegisterStaff.map(x => `<@&${x}>`) : "Ayarlanmamış.") : "Dataya Erişilemedi."}.`)
    .addField(`Jail Staff`, `${matr ? (matr.JailStaff ? matr.JailStaff.map(x => `<@&${x}>`) : "Ayarlanmamış.") : "Dataya Erişilemedi."}.`)
    .addField(`Ban Staff`, `${matr ? (matr.BanStaff ? matr.BanStaff.map(x => `<@&${x}>`) : "Ayarlanmamış.") : "Dataya Erişilemedi."}.`)
    .addField(`Mute Staff`, `${matr ? (matr.MuteStaff ? matr.MuteStaff.map(x => `<@&${x}>`) : "Ayarlanmamış.") : "Dataya Erişilemedi."}.`)
    .setFooter({ text: `Matrié <3` })

    let reg = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true }) })
    .addField(`Man Role`, `${matr ? (matr.ManRole ? matr.ManRole.map(x => `<@&${x}>`) : "Ayarlanmamış") : "Dataya Erişilemedi."}.`)
    .addField(`Woman Role`, `${matr ? (matr.WomanRole ? matr.WomanRole.map(x => `<@&${x}>`) : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .addField(`Unregister`, `${matr ? (matr.Unregister ? `<@&${matr.Unregister}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .addField(`VIP`, `${matr ? (matr.VIP ? `<@&${matr.VIP}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .addField(`Booster Role`, `${matr ? (matr.BoosterRole ? `<@&${matr.BoosterRole}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .setFooter({ text: `Matrié <3` })

    let cezali = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true }) })
    .addField(`Muted`, `${matr ? (matr.Muted ? `<@&${matr.Muted}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .addField(`Jailed`, `${matr ? (matr.Jailed ? `<@&${matr.Jailed}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .setFooter({ text: `Matrié <3` })

    let channels = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true }) })
    .addField(`Register Channel`, `${matr ? (matr.RegisterChannel ? `<#${matr.RegisterChannel}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .addField(`Chat Channel`, `${matr ? (matr.ChatChannel ? `<#${matr.ChatChannel}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .addField(`Jail Log`, `${matr ? (matr.JailLog ? `<#${matr.JailLog}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .addField(`Ban Log`, `${matr ? (matr.BanLog ? `<#${matr.BanLog}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .addField(`Mute Log`, `${matr ? (matr.MuteLog ? `<#${matr.MuteLog}>` : "Ayarlanmamış") : "Dataya Erişilemedi"}.`)
    .setFooter({ text: `Matrié <3` })

    let matrie = await message.channel.send({ embeds: [emb], components: [row] });

    let filter = button => button.member.id === message.author.id;
    let collector = matrie.createMessageComponentCollector({ filter, time: 90000 });

    collector.on("collect", async button => {
      if(button.customId === "STAFF") matrie.edit({ embeds: [s] })
      if(button.customId === "REGISTERY") matrie.edit({ embeds: [reg] })
      if(button.customId === "CEZALI") matrie.edit({ embeds: [cezali] })
      if(button.customId === "CHANNELS") matrie.edit({ embeds: [channels] });
    })

    collector.on("end", async () => {
      matrie.delete()
    })



};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "kontrol"
};

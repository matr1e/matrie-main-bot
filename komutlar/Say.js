const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Settings = require("../configration/Settings.json");
const { red, green } = require("../configration/Emojis.json");
const { bir, iki, uc, dort, bes, alti, yedi, sekiz, dokuz, sifir } = require("../configration/Emojis.json");
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
        .setDescription(`${msg}`)
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })
        if(decision === "green") message.react(green);
        if(decision === "red") message.react(red);
        if(!time) time = 30
        let times = time * 1000;
        message.channel.send({ embeds: [newemb] }).then(x => setTimeout(() => { x.delete() }, times));
      }

    const req = await botReq.findOne({ guildId: message.guild.id }).clone();

    const maple = {
        " ": "",
        "0": sifir ? sifir : "0",
        "1": bir ? bir : "1",
        "2": iki ? iki : "2",
        "3": uc ? uc : "3",
        "4": dort ? dort : "4",
        "5": bes ? bes : "5",
        "6": alti ? alti : "",
        "7": yedi ? yedi : "",
        "8": sekiz ? sekiz : "",
        "9": dokuz ? dokuz : ""
    }


    let taglılar = 0;

    let toplamUye = message.guild.members.cache.size;
    let taglıUye = message.guild.members.cache.forEach(member => { if(member.user.username.includes("Seoner")) {taglılar = taglılar + 1} });
    let sesli = message.guild.members.cache.filter(s => s.voice.channel).size;
    let boost = message.guild.premiumSubscriptionCount;
    let boostlevel = message.guild.premiumTier;
    let online = message.guild.members.cache.filter(x => x.presence && x.presence.status !== "offline").size;
    let taglılars = taglılar.toString().replace(/ /g, "     ");

    var emToplam = `${toplamUye}`.split("").map(c => maple[c] || c).join("");
    var emTagli = `${taglılars}`.split("").map(c => maple[c] || c).join("");
    var emOnline = `${online}`.split("").map(c => maple[c] || c).join("");
    var emSesli = `${sesli}`.split("").map(c => maple[c] || c).join("");
    var emBoost = `${boost}`.split("").map(c => maple[c] || c).join("");
    var emBLevel = `${boostlevel}`.split("").map(c => maple[c] || c).join("");


    if(!req.BanStaff.some(id => message.member.roles.cache.has(id)) && !message.member.permissions.has("ADMINISTRATOR")) return embed(`Yeterli yetkiniz bulunmamakta.`);

    embed(`\`⮞\` Sunucudaki toplam üye: ${emToplam} \n \`⮞\` Sunucudaki toplam taglı sayısı: ${emTagli} \n \`⮞\` Sunucudaki online üye sayısı: ${emOnline} \n \`⮞\` Sunucuda seslide sohbet eden üye sayısı: ${emSesli ||  "Yok"} \n \`⮞\` Sunucu Boost Sayısı: ${emBoost || "Yok"} \n Sunucu Boost Seviyesi: ${emBLevel}`);


};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "say"
};


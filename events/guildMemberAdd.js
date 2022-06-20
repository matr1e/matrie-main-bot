const client = require("../index");
const Settings = require("../configration/Settings.json");
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
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
// Biraz daha eklemeler var onları da yaptıktan sonra tam halini atarım abi


client.on("guildMemberAdd", async (member) => {
            
        // Welcome Sistemi
        var toplamUye = member.guild.memberCount;
        let memberDay = (Date.now() - member.user.createdTimestamp);
        let createAt = moment.duration(memberDay).format("Y [Yıl], M [Ay], W [Hafta], DD [Gün]")
        let createAt2 = moment.duration(memberDay).format("DD [Gün], HH [saat], mm [dakika]")
        const tagModedata = await tagliAlim.findOne({ guildId: Settings.GuildId });

        const req = await botReq.findOne({ guildId: member.guild.id }).clone();


        if(member.user.username.includes(Settings.Tag)){
        member.roles.add(req.TagRole);
        member.roles.add(req.Unregister);
        member.guild.channels.cache.get(req.WelcomeChannel).send(`${member} sunucumuza tag alarak katıldığı için ona <@&${Settings.TagRole}> rolünü verdim.`);

        member.guild.members.cache.get(member.guild.ownerId).send(`${member} sunucuya taglı olarak katıldı. Başka bir sunucu bizim tagımızı kullanıyor olabilir!`)
        }
        const guvenilirlik = memberDay > 604800000;


        if(member.user.bot) return member.guild.channels.cache.get(req.WelcomeChannel).send(`${member} bir bot.`);
        if(guvenilirlik){
        member.guild.channels.cache.get(req.WelcomeChannel).send(`${member} sunucuya hoşgeldin! \n\n Seninle birlikte ${toplamUye} üyeye ulaştı \n\n Hesabın ${createAt} önce açılmış |  \n\n <@&${req.RegisteryStaff}> rolündeki yetkililerimiz sizinle ilgileneceklerdir. \n\n Tagımızı almak için herhangi bir kanala \`.tag\` yazman yeterli. ${tagModedata ? tagModedata.isOpen === true ? `Şuanda taglı alımdayız` : "" : ""} `);
        } else {
        member.roles.add(req.Suspect)
        member.guild.channels.cache.get(req.WelcomeChannel).send(`${member} adlı üyenin hesabı ${createAt2} önce açıldığı için şüpheli rolü verildi.`);
        }
});

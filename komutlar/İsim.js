const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Settings = require("../configration/Settings.json");
const { red, green } = require("../configration/Emojis.json");
const tagliAlim = require("../schemas/tagliAlim");
const names = require("../schemas/names");
const staffRegData = require("../schemas/staffRegisteryData")

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


    function embed(msg, decision) {
        const newemb = new MessageEmbed()
        .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
        .setDescription(`**${msg}**`)
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })
        message.channel.send({ embeds: [newemb] });
        if(decision === "green") message.react(green);
        if(decision === "red") message.react(red)
    }

    const req = await botReq.findOne({ guildId: message.guild.id }).clone();


    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let lastName;
    let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");;
    let age = args.filter(arg => !isNaN(arg))[0] || "";


    if(!req.RegisterStaff.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has("ADMINISTRATOR")) return embed(`Yeterli yetkiniz bulunmamakta.`, "red");
    if(!member) return embed(`Lütfen bir üye etiketleyiniz.`, "red");
    if(message.author.id === member.id) return embed(`Kendi isminizi değiştiremezsiniz.`, "red");
    if(!member.manageable) return embed(`Böyle birisinin ismini değiştiremiyorum.`, "red");
    if(message.member.roles.highest.position <= member.roles.highest.position) return embed(`Seninle aynı veya yüksek yetkideki kişilerin ismini değiştiremezsin!`, "red");
    if(!name) return embed(`Lütfen bir isim giriniz.`, "red");
    if(!age) return embed(`Lütfen bir yaş giriniz.`, "red");
    
    let tagliAlims = tagliAlim.find({ guildId: message.guild.id });
    let data = await names.findOne({ guildId: message.guild.id, uyeId: member.id });
    let staffRegisteryData = staffRegData.findOne({ guildId: message.guild.id, uyeId: message.author.id });

    lastName = `${member.user.username.includes(Settings.Tag) ? Settings.Tag : (Settings.ikinciTag ? Settings.Main.ikinciTag : Settings.Tag)} ${name} | ${age}`;

    member.setNickname(`${lastName}`).catch(err => embed(`İsim çok uzun`, "red"));
    embed(`${member} üyesinin ismi başarıyla "${lastName}" olarak değiştirildi. Bu üye daha önce şu isimlerle kayıt olmuş: \n\n ${member} üyesinin toplamda **${data ? `${data.names.length}` : "0"}** isim kaydı bulundu. \n ${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` [${x.rol}] [${x.staff}]`).join(`\n`) : "Daha önceden kayıt olmamış."} \n .isimler <@Matrie/ID> komutunu kullanarak kullanıcının önceden kayıt olduğu isimleri kontrol etmeniz önerilir.`, "green")
    names.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { names: { name: member.displayName, staff: message.author.id, rol: "İsim değiştirme", date: Date.now() } } }, { upsert: true} );

};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "isim"
};

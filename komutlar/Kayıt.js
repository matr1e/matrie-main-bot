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


    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let lastName;
    let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");;
    let age = args.filter(arg => !isNaN(arg))[0] || "";

    if(!req) return embed(`Database ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);
    if(!req.ManRole) return embed(`Roller ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);
    if(!req.WomanRole) return embed(`Roller ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);
    if(!req.RegisterStaff) return embed(`Roller ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);
    if(!req.RegisterChannel) return embed(`Kanallar ayarlanmamış. Lütfen bot sahibi ile iletişime geçin! ${Settings.Footer.map(x => `<@${x}>`)}`);

    if(!req.RegisterStaff.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has("ADMINISTRATOR")) return embed(`Yeterli yetkiniz bulunmamakta.`, "red", 7);
    if(!member) return embed(`Lütfen bir üye etiketleyiniz.`, "red", 7);
    if(message.author.id === member.id) return embed(`Kendinizi kayıt edemezsiniz`, "red", 7);
    if(!member.manageable) return embed(`Böyle birisini kayıt edemiyorum.`, "red", 7);
    if(message.member.roles.highest.position <= member.roles.highest.position) return embed(`Seninle aynı veya yüksek yetkideki kişileri kayıt edemezsin!`, "red", 7);
    if(!name) return embed(`Lütfen bir isim giriniz.`, "red", 7);
    if(!age) return embed(`Lütfen bir yaş giriniz.`, "red", 7);

    
    let tagliAlims = tagliAlim.find({ guildId: message.guild.id });
    let data = await names.findOne({ guildId: message.guild.id, uyeId: member.id });
    let staffRegisteryData = staffRegData.findOne({ guildId: message.guild.id, uyeId: message.author.id });

    lastName = `${Settings.Tag} ${name} | ${age}`;
    member.setNickname(`${lastName}`).catch(err => embed(`İsim çok uzun.`, "red", 5));


    if(tagliAlim === true){
        if(!member.roles.cache.has(req.TagRole) && !member.roles.cache.has(req.BoosterRole) && !member.roles.cache.has(req.VIP)) return embed(`Taglı alım açık. ${member.toString()} adlı üyemiz \`${req.Tag}\` tagımızı almadığı için, <@${req.BoosterRole}>, <@${req.VIP}> rollerinden herhangi birisi üzerinde olmadığı için sadece İsim ve Yaş kaydı yapılabilir.`, "red");
    }

    if(!member.roles.cache.has(req.ManRole) && !member.roles.cache.has(req.WomanRole)){

        const matrie = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("MAN")
            .setLabel("Erkek")
            .setStyle("SUCCESS")
            .setEmoji(""),

            new MessageButton()
            .setCustomId("WOMAN")
            .setLabel("Kadın")
            .setStyle("DANGER")
            .setEmoji(""),

            new MessageButton()
            .setCustomId("CANCEL")
            .setLabel("İptal")
            .setStyle("SECONDARY")
            .setEmoji("")
        )

        const disabled = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("MAN")
            .setLabel("Erkek")
            .setStyle("SUCCESS")
            .setEmoji(""),

            new MessageButton()
            .setCustomId("WOMAN")
            .setLabel("Kadın")
            .setStyle("DANGER")
            .setEmoji(""),

            new MessageButton()
            .setCustomId("CANCEL")
            .setLabel("İptal")
            .setStyle("SECONDARY")
            .setEmoji("")
        )

        const Matrie = new MessageEmbed()
        .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
        .setDescription(`Lütfen 30 saniye içerisinde altta bulunan butonlara basarak kayıt işlemini tamamlayınız. \n\n ${member} üyesinin ismi başarıyla "${lastName}" olarak değiştirildi. Bu üye daha önce şu isimlerle kayıt olmuş: \n\n ${member} üyesinin toplamda **${data ? `${data.names.length}` : "0"}** isim kaydı bulundu. \n ${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` [${x.rol}] [${x.staff}]`).join(`\n`) : "Daha önceden kayıt olmamış."} \n .isimler <@GECEHAKİMİ/ID> yazarak üyenin önceki isimlerine bakmanız önerilir.`)
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })
        
        const Matr = new MessageEmbed()
        .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
        .setDescription(`${member.toString()} sunucumuza <@${message.author.id}> tarafından, ${lastName} ismiyle ${req.ManRole.length > 1 ? req.ManRole.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + req.ManRole.map(x => `<@&${x}>`).slice(-1) : req.ManRole.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt işlemi tamamlandı!`)
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })

        
        const MatrK = new MessageEmbed()
        .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
        .setDescription(`${member.toString()} sunucumuza <@${message.author.id}> tarafından, ${lastName} ismiyle ${req.WomanRole.length > 1 ? req.WomanRole.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + req.WomanRole.map(x => `<@&${x}>`).slice(-1) : req.WomanRole.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt işlemi tamamlandı!`)
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })
        
        const MatrC = new MessageEmbed()
        .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
        .setDescription(`Üyenin kayıt işlemi iptal edildi.`)
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })


        const MatrLG = new MessageEmbed()
        .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
        .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })

        const matr = await message.channel.send({ embeds: [Matrie], components: [matrie] });
        const filter = button => button.member.id === message.author.id;
        const collector = matr.createMessageComponentCollector({ filter: filter, time: 30000 });

        

        collector.on("collect", async button => {
            if(button.customId === "MAN"){
                await member.roles.remove(req.Unregister);
                for(i = 0; i < req.ManRole.length; i++){
                    await member.roles.add(req.ManRole[i]);                
                }
                await names.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { names: { name: member.displayName, staff: message.author.id, rol: req.ManRole.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true} );
                if(staffRegisteryData){
                    await staffRegData.findOneAndUpdate({ guildId: message.guild.id, staffId: message.author.id }, { $inc: { register: 1, registeredMan: 1 } }, { upsert: true })
                }
                await message.react(green);
                await matr.edit({embeds: [Matr], components: [disabled]});
                MatrLG.setDescription(`${member.toString()} sunucumuza <@${message.author.id}> tarafından, ${lastName} ismiyle ${req.ManRole.length > 1 ? req.ManRole.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + req.ManRole.map(x => `<@&${x}>`).slice(-1) : req.ManRole.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt işlemi tamamlandı!`)
                if(req.ChatChannel) {
                    message.guild.channels.cache.get(Settings.Channels.ChatChannel).send(`${member} aramıza hoşgeldin! Kuralları okumayı ihmal etme, iyi sohbetler.`)
                }
            }
            if(button.customId === "WOMAN"){
                await member.roles.remove(req.Unregister);
                for(i = 0; i < req.ManRole.length; i++){
                    await member.roles.add(req.WomanRole[i]);                
                }
                await names.findOneAndUpdate({ guildId: message.guild.id, uyeId: member.id }, { $push: { names: { name: member.displayName, staff: message.author.id, rol: req.WomanRole.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true} );
                if(staffRegisteryData){
                    await staffRegData.findOneAndUpdate({ guildId: message.guild.id, staffId: message.author.id }, { register: 1, registeredMan: 1 }, { upsert: true })
                }               
                await message.react(green);
                await matr.edit({embeds: [MatrK], components: [disabled]});
                MatrLG.setDescription(`${member.toString()} sunucumuza <@${message.author.id}> tarafından, ${lastName} ismiyle ${req.WomanRole.length > 1 ? req.WomanRole.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + req.WomanRole.map(x => `<@&${x}>`).slice(-1) : req.WomanRole.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt işlemi tamamlandı!`)
                if(req.ChatChannel) {
                    message.guild.channels.cache.get(Settings.Channels.ChatChannel).send(`${member} aramıza hoşgeldin! Kuralları okumayı ihmal etme, iyi sohbetler.`)
                }
            }
            if(button.customId === "CANCEL"){
                await matr.edit({ embeds: [MatrC], components: null })
                await member.roles.add(reqUnregister);
                await member.roles.remove(req.ManRole);
                await member.roles.remove(req.WomanRole);
            }
        })

        collector.on("end", () => {
            matr.delete();
            if(req && req.RegisterChannel) client.guilds.cache.get(Settings.GuildId).channels.cache.get(req.RegisterChannel).send({ embeds: [MatrLG] });
        });
    }
};
exports.conf = {
  aliases: ["e", "k", "kız", "erkek"]
};

exports.help = {
  name: "kayıt"
};

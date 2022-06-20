const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Settings = require("../configration/Settings.json");
const { red, green } = require("../configration/Emojis.json");
const tagliAlim = require("../schemas/tagliAlim");
const names = require("../schemas/names");
const staffRegData = require("../schemas/staffRegisteryData")
const botReq = require("../schemas/botRequirements");

exports.run = async (client, message, args) => {

  function embed(msg, decision, time) {
    const newemb = new MessageEmbed()
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })})
    .setDescription(`**${msg}**`)
    .setFooter({ text: `Matrié 💚 ${Settings.GuildName}` })
    if(!time) time = 7
    let times = time * 1000;
    message.channel.send({ embeds: [newemb] }).then(x => setTimeout(() => { x.delete() }, times));
    if(!decision) return;
    if(decision === "green") message.react(green);
    if(decision === "red") message.react(red);
  }

    let sec = args[0];
    let cr;
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

    if(role) cr = role;
    if(channel) cr = channel;

    if(!Settings.Footer.some(id => message.author.id === id)) return embed(`Yeterli yetkiniz bulunmamakta.`)

    /* BURASI YETKİLER */

    if(sec === "regStaff"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $push: { RegisterStaff: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Register Staff" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "jailStaff"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $push: { JailStaff: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Jail Staff" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "muteStaff"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $push: { MuteStaff: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Mute Staff" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "banStaff"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $push: { BanStaff: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Ban Staff" olarak ayarlandı!`, "green", 10);
    }


    /* BURASI KAYIT ROLLERİ */


    if(sec === "man"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $push: { ManRole: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Erkek Rol" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "woman"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $push: { WomanRole: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Kadın Rol" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "vipRole"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { VIP: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "VIP" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "boosterRole"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { BoosterRole: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Booster" olarak ayarlandı!`, "green", 10);
    }

    /* BURASI TEKLİ ROLLER */

    if(sec === "unregRole"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { Unregister: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Unregister" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "jailedRole"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { Jailed: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Jailed Role" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "mutedRole"){
      if(!cr) return embed(`Bir rol etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { Muted: cr.id } }, { upsert: true });
      embed(`Başarıyla <@&${cr.id}> adlı rol "Muted Role" olarak ayarlandı!`, "green", 10);
    }



    /* BURASI KANALLAR */ 

    if(sec === "chatCh"){
      if(!cr) return embed(`Bir kanal etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { ChatChannel: cr.id } }, { upsert: true });
      embed(`Başarıyla <#${cr.id}> adlı rol "Chat Kanalı" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "regLogCh"){
      if(!cr) return embed(`Bir kanal etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { RegisterChannel: cr.id } }, { upsert: true });
      embed(`Başarıyla <#${cr.id}> adlı rol "Register Log" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "jLogCh"){
      if(!cr) return embed(`Bir kanal etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { JailLog: cr.id } }, { upsert: true });
      embed(`Başarıyla <#${cr.id}> adlı rol "Jail Log" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "banLogCh"){
      if(!cr) return embed(`Bir kanal etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { BanLog: cr.id } }, { upsert: true });
      embed(`Başarıyla <#${cr.id}> adlı rol "Ban Log" olarak ayarlandı!`, "green", 10);
    }

    if(sec === "muteLogCh"){
      if(!cr) return embed(`Bir kanal etiketlemelisiniz!`);
      await botReq.findOneAndUpdate({ guildId: message.guild.id }, { $set: { MuteLog: cr.id } }, { upsert: true });
      embed(`Başarıyla <#${cr.id}> adlı rol "Mute Log" olarak ayarlandı!`, "green", 10);
    }

};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "ayarla"
};

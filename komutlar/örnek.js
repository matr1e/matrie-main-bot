const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Settings = require("../configration/Settings.json");
const { red, green } = require("../configration/Emojis.json");
const tagliAlim = require("../schemas/tagliAlim");
const names = require("../schemas/names");
const staffRegData = require("../schemas/staffRegisteryData")
const botReq = require("../schemas/botRequirements");

exports.run = async (client, message, args) => {


	message.channel.send("Örnek komutu çalışıyor!")


};
exports.conf = {
  aliases: []
};

exports.help = {
  name: "örnek"
};

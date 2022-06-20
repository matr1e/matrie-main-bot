const client = require("../index");
const Settings = require("../configration/Settings.json");

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


client.on("ready", () => {
    console.log(`${client.user.tag} İsmi İle Bot Aktif!`)
    client.user.setPresence({ activities: [{ name: `Matrié 💚 ${Settings.GuildName}`, type: "STREAMING", url: "https://youtube.com/matr1e"  }], status: "idle" })

    var JoinChannel = client.channels.cache.get("Bot Voice Channel ID");
 
    const { joinVoiceChannel } = require('@discordjs/voice');
   
    if(JoinChannel){
   const connection = joinVoiceChannel({
       channelId: JoinChannel.id,
       guildId: JoinChannel.guild.id,
       adapterCreator: JoinChannel.guild.voiceAdapterCreator,
   });
    } else {
      console.log("Bot failed to login to a voice channel")
    }
});

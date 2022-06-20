const mongoose = require("mongoose");

const botReq = mongoose.Schema({
    guildId: { type: String, default: "" },
    RegisterStaff: { type: Array, default: [] },
    JailStaff: { type: Array, default: [] },
    MuteStaff: { type: Array, default: [] },
    BanStaff: { type: Array, default: [] },
    
    ManRole: { type: Array, default: [] },
    WomanRole: { type: Array, default: [] },
    Unregister: { type: String, default: "" },
    VIP: { type: String, default: "" },
    BoosterRole: { type: String, default: "" },

    Jailed: { type: String, default: "" },
    Muted: { type: String, default: "" },

    RegisterChannel: { type: String, default: "" },
    ChatChannel: { type: String, default: "" },
    JailLog: { type: String, default: "" },
    BanLog: { type: String, default: "" },
    MuteLog: { type: String, default: "" },

})

module.exports = mongoose.model("botReqs", botReq);
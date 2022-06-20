const mongoose = require("mongoose");

const inviteSchema = mongoose.Schema({
    guildId: { type: String, default: "" },
    uyeId: { type: String, default: "" },
    inviter: { type: String, default: "" },
    date: { type: String, default: "" }
})

module.exports = mongoose.model("inviteSchema", inviteSchema);
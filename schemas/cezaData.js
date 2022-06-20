const mongoose = require("mongoose");

const ceza = mongoose.Schema({
    guildId: { type: String, default: "" },
    uyeId: { type: String, default: "" },
    cezalar: { type: Array, default: [] },
    isActive: { type: Boolean, default: false }
})

module.exports = mongoose.model("cezaData", ceza);
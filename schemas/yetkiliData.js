const mongoose = require("mongoose");

const coin = mongoose.Schema({
    guildId: { type: String, default: "" },
    uyeId: { type: String, default: "" },
    yetkiliS: { type: Array, default: [] }
})

module.exports = mongoose.model("yetkiliData", coin);
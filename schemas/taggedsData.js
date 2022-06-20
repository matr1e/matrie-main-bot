const mongoose = require("mongoose");

const coin = mongoose.Schema({
    guildId: { type: String, default: "" },
    uyeId: { type: String, default: "" },
    tagged: { type: Array, default: [] }
})

module.exports = mongoose.model("taggeds", coin);
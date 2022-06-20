const mongoose = require("mongoose");

const coin = mongoose.Schema({
    guildId: { type: String, default: "" },
    uyeId: { type: String, default: "" },
    tagged: { type: Number, default: 0 }
})

module.exports = mongoose.model("tagDuty", coin);

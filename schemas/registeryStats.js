const mongoose = require("mongoose");

const names = mongoose.Schema({
    guildId: { type: String, default: "" },
    uyeId: { type: String, default: "" },
    names: { type: Array, default: [] },
    staff: { type: String, default: "" }
})

module.exports = mongoose.model("names", names);
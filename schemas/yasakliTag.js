const mongoose = require("mongoose");

const yasakliTag = mongoose.Schema({
    guildId: { type: String, default: "" },
    yasakliTag: { type: Array, default: [] }
})

module.exports = mongoose.model("yasakliTag", yasakliTag);
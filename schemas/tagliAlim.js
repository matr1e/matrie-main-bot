const mongoose = require("mongoose");

const tagliAlim = mongoose.Schema({
    guildId: String,
    isOpen: Boolean
})

module.exports = mongoose.model("tagliAlim", tagliAlim);
const mongoose = require("mongoose");

const regData = mongoose.Schema({
    guildId: { type: String, default: ""},
    staffId: { type: String, default: ""},
    register: { type: Number, default: 0 },
    registeredMan: { type: Number, default: 0},
    registeredWoman: { type: Number, default: 0 }
})

module.exports = mongoose.model("staffRegisteryData", regData);
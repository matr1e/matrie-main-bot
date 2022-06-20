const mongoose = require("mongoose");

const inviterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: { type: String, default: "" },
    uyeId: { type: String, default: "" },
    inviterId: { type: String, default: "" },
    top: { type: Number, default: 0 },
    real: { type: Number, default: 0 },
    fake: { type: Number, default: 0 },
    leave: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },

})

module.exports = mongoose.model("inviterSchema", inviterSchema);
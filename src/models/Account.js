const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
    accountId: { type: String, default: "0.0.0" },
    playerId: {type: String, default: ""},
    avatarUrl: {type: String, default: ""},
    description: {type: String, default: ""}
}, { timestamps: true });

module.exports = User = mongoose.model('Account', AccountSchema);

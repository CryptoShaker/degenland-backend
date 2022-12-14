const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
    accountId: { type: String, default: "0.0.0" },
    playerId: {type: String, default: ""},
    avatarUrl: {type: String, default: ""},
    description: {type: String, default: ""},
    address: {type: String, default: ""},
    targetPos: {type: String, default: ""},
    x: {type: Number, default: 0},
    y: {type: Number, default: 0},
    n: {type: Number, default: 0},
    m: {type: Number, default: 0},
    socketId: {type: String, default: ""},
    connectState: {type: Boolean, default: false}
}, { timestamps: true });

module.exports = User = mongoose.model('Account', AccountSchema);

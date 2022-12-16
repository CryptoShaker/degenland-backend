const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
    accountId: { type: String, default: "0.0.0" },
    playerId: {type: String, default: ""},
    level: {type: Number, default: 1},
    nextLevel: {type: Number, default: 2},
    currentLevelScore: {type: Number, default: 0},
    targetLevelScore: {type: Number, default: 50},
    friendList: {type: Array, default: []},
    avatarUrl: {type: String, default: ""},
    phaserAvatarUrl: {type: String, default: ""},
    description: {type: String, default: ""},
    address: {type: String, default: ""},
    targetPos: {type: String, default: ""},
    x: {type: Number, default: 0},
    y: {type: Number, default: 0},
    n: {type: Number, default: 0},
    m: {type: Number, default: 0},
    socketId: {type: String, default: ""},
    degenlandCount: {type: Number, default: 0},
    tycoonCount: {type: Number, default: 0},
    mogulCount: {type: Number, default: 0},
    investorCount: {type: Number, default: 0},
    connectState: {type: Boolean, default: false}
}, { timestamps: true });

module.exports = User = mongoose.model('Account', AccountSchema);

const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  playerId: { type: String, required: true },
  alertType: { type: String, required: true },
  playerInfo: {
    accountId: { type: String, required: true },
    playerId: { type: String, required: true },
    playerLvl: { type: Number, required: true },
    lvlProcess: { type: Number, required: true },
    friendFlag: { type: Boolean, required: true },
    aliveFlag: { type: Boolean, required: true },
    avatarUrl: { type: String, required: true },
    degenlandNftCount: { type: Number, required: true },
    tycoonNftCount: { type: Number, required: true },
    mogulNftCount: { type: Number, required: true },
    investorNftCount: { type: Number, required: true }
  },
  message: { type: String, default: '' },
  state: { type: String, required: true, default: 'unread' },
  date: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model('Notification', NotificationSchema);

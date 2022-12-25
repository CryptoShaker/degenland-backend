const mongoose = require('mongoose');
const OfferListSchema = new mongoose.Schema({
  providerInfo: {
    accountId: { type: String, default: "" },
    playerId: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    connectState: { type: Boolean, default: false },
    level: { type: Number, default: 1 },
    currentLevelScore: {type: Number, default: 0},
    targetLevelScore: {type: Number, default: 50},
  },
  providerToken: {
    hbar: { type: Number, default: 0 },
    pal: { type: Number, default: 0 }
  },
  providerNfts: [
    {
      tokenId: { type: String, default: "" },
      serialNum: { type: Number, default: -1 },
      nft_type: { type: String, default: "LandNft" },
      imgUrl: { type: String, default: "" },
      creator: { type: String, default: "" },
      name: { type: String, default: "" },
      buildingCount: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      totalVisitor: { type: Number, default: 0 }
    }
  ],
  receiverInfo: {
    accountId: { type: String, default: "" },
    playerId: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    connectState: { type: Boolean, default: false },
    level: { type: Number, default: 1 },
    currentLevelScore: {type: Number, default: 0},
    targetLevelScore: {type: Number, default: 50},
  },
  receiverToken: {
    hbar: { type: Number, default: 0 },
    pal: { type: Number, default: 0 }
  },
  receiverNfts: [
    {
      tokenId: { type: String, default: "" },
      serialNum: { type: Number, default: -1 },
      nft_type: { type: String, default: "LandNft" },
      imgUrl: { type: String, default: "" },
      creator: { type: String, default: "" },
      name: { type: String, default: "" },
      buildingCount: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      totalVisitor: { type: Number, default: 0 }
    }
  ],
  state: { type: String, required: true, default: 'unread' },
  date: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model('OfferList', OfferListSchema);

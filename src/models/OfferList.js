const mongoose = require('mongoose');
const OfferListSchema = new mongoose.Schema({
  providerAccountId: { type: String, default: "" },
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
  receiverAccountId: { type: String, default: "" },
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

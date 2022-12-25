const express = require('express');
const router = express.Router();
const nftSwapOffer = require("./controller");

router.get('/get_offer', nftSwapOffer.getOffer);
router.get('/get_offer_list', nftSwapOffer.getOfferList);
module.exports = router;

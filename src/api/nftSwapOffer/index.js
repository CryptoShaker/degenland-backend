const express = require('express');
const router = express.Router();
const nftSwapOffer = require("./controller");

router.get('/get_offer', nftSwapOffer.getOffer);
module.exports = router;

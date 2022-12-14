const express = require('express');
const router = express.Router();
const nft = require("./controller");

router.post('/set_nft', nft.setNft);
router.get('/get_nftData', nft.getNFTData);
module.exports = router;

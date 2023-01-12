const express = require('express');
const router = express.Router();
const stake = require("./controller");

router.get('/load_staked_nfts', stake.loadStakedNfts);

router.post('/stake_new_nfts', stake.stakeNewNfts);

module.exports = router;

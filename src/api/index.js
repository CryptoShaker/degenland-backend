const express = require('express');
const router = express.Router();

const Account = require("./account");
const Placement = require("./placement");
const Nft = require("./nft");
const Place = require("./place");

router.use("/account", Account);
router.use("/placement", Placement);
router.use("/nft", Nft);
router.use("/place", Place);

module.exports = router;

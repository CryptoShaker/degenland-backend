const express = require('express');
const router = express.Router();

const Account = require("./account");
const Placement = require("./placement");
const Nft = require("./nft");
const Place = require("./place");
const Notification = require("./notification");

router.use("/account", Account);
router.use("/placement", Placement);
router.use("/nft", Nft);
router.use("/place", Place);
router.use("/notification", Notification);

module.exports = router;

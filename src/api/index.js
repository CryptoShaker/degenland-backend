const express = require('express');

const Account = require("./account");
const Building = require("./building");
const router = express.Router();

router.use("/account", Account);
router.use("/building", Building);

module.exports = router;

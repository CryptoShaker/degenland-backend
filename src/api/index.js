const express = require('express');

const Account = require("./account");
const router = express.Router();

router.use("/account", Account);

module.exports = router;

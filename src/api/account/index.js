const express = require('express');
const router = express.Router();
const account = require("./controller");

router.post('/upload_avatar', account.uploadAvatar);
module.exports = router;

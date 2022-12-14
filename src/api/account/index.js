const express = require('express');
const router = express.Router();
const account = require("./controller");

router.post('/create_new_player', account.createNewPlayer);
router.get('/get_player', account.getPlayerInfo);
router.get('/get_allplayer', account.getAllPlayerInfo);
router.post('/upload_avatar', account.uploadAvatar);
module.exports = router;

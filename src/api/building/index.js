const express = require('express');
const router = express.Router();
const building = require("./controller");

//router.get('/get_url', building.getUrl);
router.post('/get_url', building.getUrl);
module.exports = router;

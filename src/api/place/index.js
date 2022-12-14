const express = require('express');
const router = express.Router();
const place = require("./controller");

router.get('/get_current_visitor', place.getcurrentVisitor);
router.post('/decrease_visitor', place.decreaseVisitor);
module.exports = router;

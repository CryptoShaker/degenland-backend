const express = require('express');
const router = express.Router();
const MapPlacement = require('../../models/MapPlacement');

// @route   GET api/auth
// @desc    Authenticate by token
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { address } = req.body;
    const map = await MapPlacement.findOne({ address });

    res.send(map.placementstring);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

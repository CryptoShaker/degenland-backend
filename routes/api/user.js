const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Authenticate by token
// @access  Public
router.get('/', async (req, res) => {
  console.log("AAA");
  try {
    let user = await User.find({});
    console.log(user);
    if(!user) {
      return res.status(400).json({ msg: 'There is no user' });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth
// @desc    Authenticate by token
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { walletid, address, targetPos, x, y } = req.body;
    const userFields = {};

    userFields.walletid = walletid;
    userFields.address = address;
    userFields.targetPos = targetPos;
    userFields.x = x;
    userFields.y = y;

    let user = await User.findOne({ walletid: walletid });
    console.log("find");
    console.log(user);
    if(user) {
      console.log("update");
      user = await User.findOneAndUpdate(
        { walletid: walletid },
        { $set: userFields },
        { new: true }
      );
    } else {
      console.log("create");
      let user = new User(userFields);
      // Save user to DB
      await user.save();
    }
    res.send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const Place = require('../../models/Place');
const Account = require('../../models/Account');

exports.decreaseVisitor = async (req, res) => {
  try {
    console.log(req.body.address, req.body.pos);
    if (!req.body.address || !req.body.pos) {
      res.send({
        status: false,
        message: 'failed'
      });
    } else {
      let place = await Place.findOne({ address: req.body.address, pos: req.body.pos });
      console.log(place.currentVisitor);

      place = await Place.findOneAndUpdate(
        { address: req.body.address, pos: req.body.pos },
        {
          currentVisitor: --place.currentVisitor
        },
        { new: true }
      );

      //send response
      res.send({
        status: true,
        message: 'Success',
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

exports.getcurrentVisitor = async (req, res) => {
  try {
    const address = req.query.address;
    const pos = req.query.pos;

    place = await Place.findOne({ address: address, pos: pos });

    //send response
    res.send({
      status: true,
      message: 'Success',
      data: place.currentVisitor
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

exports.getPlaceInfo = async (req, res) => {
  try {
    const address = req.query.address;
    const targetPos = req.query.targetPos;
    const nftdata = JSON.parse(req.query.nftdata);

    let placeOwner = await Account.findOne({ accountId: nftdata.owner });

    place = await Place.findOneAndUpdate(
      { token_id: nftdata.token_id, serialNumber: nftdata.serial_number },
      {
        address: address,
        pos: targetPos,
        owner: nftdata.owner,
        avatarUrl: placeOwner.avatarUrl
      },
      { new: true }
    );

    //send response
    res.send({
      status: true,
      message: 'Success',
      data: place
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

exports.updatePlaceInfo = async (req, res) => {
  try {
    const address = req.query.address;
    const targetPos = req.query.targetPos;

    place = await Place.findOne({ address: address, pos: targetPos });

    //send response
    res.send({
      status: true,
      message: 'Success',
      data: place
    });
  } catch (err) {
    res.status(500).send(err);
  }
}
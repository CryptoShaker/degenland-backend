const Place = require('../../models/Place');

exports.decreaseVisitor = async (req, res) => {
  try {
    if (!req.body.address || !req.body.pos) {
        res.send({
          status: false,
          message: 'failed'
        });
    } else {
      let place = await Place.findOne({ address: req.body.address, pos: req.body.pos });

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
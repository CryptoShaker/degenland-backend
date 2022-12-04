const Building = require('../../models/Building');

exports.getUrl = async (req, res) => {
    console.log("getUrl");
//    console.log(req.params.body);
    console.log(req.body);
    try {
        if (!req.body.address || !req.body.pos) {
            res.send({
              status: false,
              message: 'failed'
            });
        } else {
          let building = await Building.findOne({ address: req.body.address, pos: req.body.pos });

          //send response
          res.send({
            status: true,
            message: 'Success',
            data: building.linkurl
          });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}